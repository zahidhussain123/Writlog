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

export const fetchFeaturedPosts = async ({ queryKey }) => {
  const [, limit = 4] = queryKey;
  const res = await axios.get(`${BASE_URL}/posts`, {
    params: { limit, sort: "popular" },
  });
  return res.data;
};

export const fetchSinglePost = async (slug) => {
  const res = await axios.get(`${BASE_URL}/posts/${slug}`);
  return res.data;
};

export const deletePost = async (id, getToken) => {
  const token = await getToken();
  const res = await axios.delete(`${BASE_URL}/posts/post/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
