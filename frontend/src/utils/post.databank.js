import axios from "axios";

export const fetchAllPosts = async () => {
  try {
    const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/posts`);
    return res.data;
  } catch (error) {
    throw new Error("Error fetching posts", error);
  }
};

export const createNewPost = async (payload, getToken) => {
  const token = await getToken();
  try {
    const newPost = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/posts/post`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return newPost.data;
  } catch (error) {
    console.log(error);
  }
};

export const fetchInfinitePosts = async ({ pageParam = 1, queryKey }) => {
  const limit = queryKey[1]; // Get limit from queryKey
  const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/posts`, {
    params: { page: pageParam, limit }
  });
  return res.data;
};

export const fetchSinglePost = async (slug) => {
  const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/posts/${slug}`);
  return res.data;
};

export const getPost = async (slug) => {};
