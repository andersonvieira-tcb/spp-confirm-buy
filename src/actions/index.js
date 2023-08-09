"use server";

import api from "@/services";
import { fromEnv } from "@aws-sdk/credential-providers"; // ES6 import

export const post = async (data) => {
  "use server";
  const res = await api
    .post("/", data)
    .then((res) => {
      console.log(res);
      return res.data;
    })
    .catch((err) => {
      console.log(err);
      return false;
    });
  return res;
};
