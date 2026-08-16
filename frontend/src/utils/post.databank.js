import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const fetchAllPosts = async () => {
  const res = await axios.get(`${BASE_URL}/posts`);
  return res.data;
};

export const createNewPost = async (payload, getToken) => {
  const token = await getToken();
  const res = await axios.post(`${BASE_URL}/posts/post`, payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const fetchInfinitePosts = async ({ pageParam = 1, queryKey }) => {
  const [, limit, searchParams = {}] = queryKey;
  const res = await axios.get(`${BASE_URL}/posts`, {
    params: { page: pageParam, limit, ...searchParams },
  });
  return res.data;
};

/**
 * Featured posts are hand-picked by an admin (`isFeatured`). Until enough are
 * flagged, the section is topped up with the most-viewed posts so it never
 * renders half-empty.
 */
export const fetchFeaturedPosts = async ({ queryKey }) => {
  const [, limit = 4] = queryKey;

  const { data } = await axios.get(`${BASE_URL}/posts`, {
    params: { limit, featured: "true" },
  });

  const featured = data?.posts ?? [];
  if (featured.length >= limit) {
    return { ...data, posts: featured.slice(0, limit) };
  }

  const { data: popular } = await axios.get(`${BASE_URL}/posts`, {
    params: { limit, sort: "popular" },
  });

  const alreadyShown = new Set(featured.map((post) => post._id));
  const filler = (popular?.posts ?? []).filter(
    (post) => !alreadyShown.has(post._id)
  );

  return { ...data, posts: [...featured, ...filler].slice(0, limit) };
};


export const fetchSinglePost = async (slug, getToken) => {
  const token = getToken ? await getToken() : null;
  const res = await axios.get(`${BASE_URL}/posts/${slug}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return res.data;
};


export const toggleLikePost = async (id, getToken) => {
  const token = await getToken();
  const res = await axios.post(`${BASE_URL}/posts/post/${id}/like`, null, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const updatePost = async (id, payload, getToken) => {
  const token = await getToken();
  const res = await axios.patch(`${BASE_URL}/posts/post/${id}`, payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const deletePost = async (id, getToken) => {
  const token = await getToken();
  const res = await axios.delete(`${BASE_URL}/posts/post/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
