import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

/** The signed-in reader's own row, including the handle `?author=` filters on. */
export const fetchCurrentUser = async (getToken) => {
  const token = await getToken();
  const res = await axios.get(`${BASE_URL}/users/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
