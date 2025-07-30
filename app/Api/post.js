import { Alert } from "react-native";
import client from "./client";


export const LogIn = async (userData) => {
  // console.log(userData)
  try {
    const response = await client
      .post("/login", userData)
      // .then((response) => console.log(response.data))
      // .catch((error) => console.log({ error }));

    return response;
  } catch (error) {
    return { error };
  }
}

export const getUserData = async (token) =>{
  try {
    const response = await client.post("/user-data", {token})
    // console.log(token)
    return response;
  } catch (error) {
    return { error };
  }
}

export const createPost = async (post) => {
  try {
    const create = await client
      .post("/clinical", post)
      .then((response) => console.log(response.data))
      .catch((error) => console.log({ error }));

    return create;
  } catch (error) {
    return { error };
  }
};

export const createCase = async (post) => {
  try {
    const create = await client
      .post("/create-case", post, {
            headers: {
              "Content-Type": "multipart/form-data",
              // Authorization: `Bearer ${token}`, // if needed
            },
          })
      .catch((error) => console.log({ error }));

    return create;
  } catch (error) {
    return { error };
  }
};


// export const getCase = async (animal, category) => {
//   // console.log("category =>",category)
//   try {
//     const { data } = await client.get(`/get-case?animal=${animal}&category=${category}`);
//     return data;
//   } catch (error) {
//     return { error };
//   }
// };

// Pagination in cases

export const getCase = async (animal, category, page = 1, limit = 5) => {
  try {
    const { data } = await client.get(
      `/get-case?animal=${animal}&category=${category}&page=${page}&limit=${limit}`
    );
    return data;
  } catch (error) {
    console.error("Error fetching cases:", error);
    return [];
  }
};

export const SearchCase = async (title, animal) => {
  // console.log(title)
  try {
    const response  = await client.get(`/search-case?title=${title}&animal=${animal}`);
    return response;
  } catch (error) {
    return { error };
  }
};

export const SearchAll = async (title) => {
  // console.log(title)
  try {
    const response  = await client.get(`/search-All?title=${title}`);
    return response;
  } catch (error) {
    return { error };
  }
};


// Recent case pagination

export const recentCases = async (page = 1, limit = 5) => {
  try {
    const { data } = await client.get(`/recentCases?page=${page}&limit=${limit}`);
    return data;
  } catch (error) {
    return { error };
  }
};

// Recent case category with pagination
// Function to fetch cases by category with pagination
export const recentCaseCategory = async (category, page = 1, limit = 5) => {
  try {
    const { data } = await client.get(`/recentCaseCategory?category=${category}&page=${page}&limit=${limit}`);
    return data;
  } catch (error) {
    console.error("Error fetching cases for category:", error);
    return { error: "Failed to fetch data" };
  }
};



export const getPost = async () => {
  try {
    const { data } = await client.get("/clinical-post");
    return data;
  } catch (error) {
    return { error };
  }
};

export const signUp = async (userData) => {
  try {
    const create = await client
      .post("/signUp", userData)
      .then((response) => {
        console.log(response.data);
        if (response.data.status === "ok") {
          Alert.alert("Registered successfully !!");
        } else {
          Alert.alert(JSON.stringify(response.data));
        }
      })
      .catch((error) => console.log({ error }));
    return create;
  } catch (error) {
    return { error };
  }
};

export const updateProfile = async (userData) => {
  try {
    const response = await client
      .post("/update-user", userData)
      // .then((response) => {
      //   console.log(response.data);
      //   if (response.data.status === "ok") {
      //     Alert.alert("Updated successfully !!");
      //   } else {
      //     Alert.alert(JSON.stringify(response.data));
      //   }
      // })
      // .catch((error) => console.log({ error }));
    return response;
  } catch (error) {
    return { error };
  }
};

export const createStory = async (userData) => {
  try {
    const create = await client
      .post("/write-story", userData)
      // .then((response) => {
      //   console.log(response.data);
      //   if (response.data.status === "ok") {
      //     Alert.alert("story created at");
      //   } else {
      //     Alert.alert(JSON.stringify(response.data));
      //   }
      // })
      // .catch((error) => console.log({ error }));

    return create;
  } catch (error) {
    return { error };
  }
};

export const resetPassword = async (userData) => {
  try {
    const create = await client
      .post("/reset-password", userData)
    return create;
  } catch (error) {
    return { error };
  }
};

export const getStory = async (page = 1, limit = 5) => {
  try {
    const { data } = await client.get(`/stories-users?page=${page}&limit=${limit}`);
    return data;
  } catch (error) {
    return { error };
  }
};

export const myStory = async (authorId) => {
  try {
    const { data } = await client.get(`/mystory/${authorId}`);
    return data;
  } catch (error) {
    return { error };
  }
};

export const myThread = async (authorId) => {
  try {
    const  response  = await client.get(`/get-my-threads/${authorId}`);
    return response.data.threads;
  } catch (error) {
    return { error };
  }
};

// Question with formData
export const questions = async (userData) => {
  try {
    const response = await client.post("/questions", userData, {
      headers: {
        "Content-Type": "multipart/form-data",
        // Authorization: `Bearer ${token}`, // if needed
      },
    });
    return response;
  } catch (error) {
    console.error("Error in questions():", error);
    return { error };
  }
};

// export const questions = async (userData) => {
//   try {
//     const response = await client.post("/questions", userData);
//     return response;
//   } catch (error) {
//     console.error("Error in questions():", error);
//     return { error };
//   }
// };


// export const getQuestions = async () => {
//   try {
//     const { data } = await client.get("/get-questions");
//     return data;
//   } catch (error) {
//     return { error };
//   }
// };

// get Qns with search by username
// export const getQuestions = async (search="") => {
//   try {
//     const  {data}  = await client.get(`/get-questions?search=${encodeURIComponent(search)}` );
//     return data;
//   } catch (error) {
//     return { error };
//   }
// };

// get Qns with load more btn

export const getQuestions = async (search = "", page = 1, limit = 5) => {
  try {
    const { data } = await client.get(
      `/get-questions?search=${encodeURIComponent(search)}&page=${page}&limit=${limit}`
    );
    return data;
  } catch (error) {
    return { error };
  }
};

export const getThreads = async (pageNumber = 1, THREAD_LIMIT = 5) => {
  try {
    const response = await client.get(
      `/get-threads?page=${pageNumber}&limit=${THREAD_LIMIT}`
    );
    return response;
  } catch (error) {
    return { error };
  }
};


export const recentQA = async () => {
  try {
    const { data } = await client.get("/recentQA");
    return data;
  } catch (error) {
    return { error };
  }
};

export const myQA = async (authorId) => {
  //  console.log("author id", authorId);
  try {
    const { data } = await client.get(`/myQA/${authorId}`);
    return data;
  } catch (error) {
    return { error };
  }
};

export const MyCase = async (authorId) => {
  // console.log("author id", authorId);
 try {
   const { data } = await client.get(`/myCases/${authorId}`);
   return data;
 } catch (error) {
   return { error };
 }
};

export const RelatedCase = async (animal,category,author,postId) => {
  // console.log("author =>", author,category,postId,animal );
  try {
    const { data } = await client.get(`/related-cases?animal=${animal}&category=${category}&author=${author}&postId=${postId}`);
    return data;
  } catch (error) {
    return { error };
  }
};

export const addComment = async(userData)=>{
  try {
    const create = await client
      .post("/addComment", userData)
      // .then((response) => {
      //   console.log(response.data);
      //   if (response.data.status === "ok") {
      //     Alert.alert("comment added");
      //   } else {
      //     Alert.alert(JSON.stringify(response.data));
      //   }
      // })
      .catch((error) => console.log({ error }));

    return create;
  } catch (error) {
    return { error };
  }
}

export const getComments = async (postId) => {
  // console.log("posts id", postId);
  try {
    const { data } = await client.get(`/get-comments/${postId}`);
    return data;
  } catch (error) {
    return { error };
  }
};

export const getAllCase = async () => {
  // console.log("posts id", postId);
  try {
    const { data } = await client.get("/All-case");
    return data;
  } catch (error) {
    return { error };
  }
};


export const addReply = async(userData)=>{
  try {
    const create = await client
      .put("/reply", userData)
      // .then((response) => {
      //   console.log(response.data);
      //   if (response.data.status === "ok") {
      //     Alert.alert("reply added");
      //   } else {
      //     Alert.alert(JSON.stringify(response.data));
      //   }
      // })
      .catch((error) => console.log({ error }));

    return create;
  } catch (error) {
    return { error };
  }
}

export const Like = async(userData)=>{
  // console.log(userData)
  try {
    const create = await client
      .put("/like", userData)
      // .then((response) => {
      //   console.log(response.data);
      //   if (response.data.status === "ok") {
      //     Alert.alert("like added");
      //   } else {
      //     Alert.alert(JSON.stringify(response.data));
      //   }
      // })
      .catch((error) => console.log({ error }));

    return create;
  } catch (error) {
    return { error };
  }
}


export const LikeThread = async(userData)=>{
  // console.log(userData)
  try {
    const create = await client
      .put("/like-thread", userData)
      .catch((error) => console.log({ error }));

    return create;
  } catch (error) {
    return { error };
  }
}

export const unLikeThread = async(userData)=>{
  // console.log(userData)
  try {
    const create = await client
      .put("/unlike-thread", userData)
      .catch((error) => console.log({ error }));

    return create;
  } catch (error) {
    return { error };
  }
}

export const unLike = async(userData)=>{
  // console.log(userData)
  try {
    const create = await client
      .put("/unlike", userData)

      .catch((error) => console.log({ error }));

    return create;
  } catch (error) {
    return { error };
  }
}

export const likeComment = async(userData)=>{
  // console.log(userData)
  try {
    const create = await client
      .put("/like-comment", userData)
      .catch((error) => console.log({ error }));

    return create;
  } catch (error) {
    return { error };
  }
}

export const unLikeComment = async(userData)=>{
  // console.log(userData)
  try {
    const create = await client
      .put("/unlike-comment", userData)
      .catch((error) => console.log({ error }));

    return create;
  } catch (error) {
    return { error };
  }
}

export const Bookmark = async(userData)=>{
  // console.log(userData)
  try {
    const create = await client
      .put("/bookmark-add", userData)

    return create;
  } catch (error) {
    return { error };
  }
}

export const unBookmark = async (userData)=>{
  // console.log(userData)
  try {
    const create = await client
      .put("/bookmark-remove", userData)


    return create;
  } catch (error) {
    return { error };
  }
}

export const BookmarkStory = async(userData)=>{
  // console.log(userData)
  try {
    const create = await client
      .put("/bookmark-story", userData)
      .then((response) => {
        console.log(response.data);
        if (response.data.status === "ok") {
          Alert.alert("Story bookmarked");
        } else {
          Alert.alert(JSON.stringify(response.data));
        }
      })
      .catch((error) => console.log({ error }));

    return create;
  } catch (error) {
    return { error };
  }
}

export const BookmarkThread = async(userData)=>{
  // console.log(userData)
  try {
    const create = await client
      .put("/bookmark-thread", userData)
      // .then((response) => {
      //   console.log(response.data);
      //   if (response.data.status === "ok") {
      //     Alert.alert("Story bookmarked");
      //   } else {
      //     Alert.alert(JSON.stringify(response.data));
      //   }
      // })
      .catch((error) => console.log({ error }));

    return create;
  } catch (error) {
    return { error };
  }
}

export const UnBookmarkThread = async (userData)=>{
  // console.log(userData)
  try {
    const create = await client
      .put("/unbookmark-thread", userData)
      // .then((response) => {
      //   console.log(response.data);
      //   if (response.data.status === "ok") {
      //     Alert.alert("Bookmark removed");
      //   } else {
      //     Alert.alert(JSON.stringify(response.data));
      //   }
      // })
      .catch((error) => console.log({ error }));

    return create;
  } catch (error) {
    return { error };
  }
}

export const UnBookmarkStory = async (userData)=>{
  // console.log(userData)
  try {
    const create = await client
      .put("/unbookmark-story", userData)
      .then((response) => {
        console.log(response.data);
        if (response.data.status === "ok") {
          Alert.alert("Bookmark removed");
        } else {
          Alert.alert(JSON.stringify(response.data));
        }
      })
      .catch((error) => console.log({ error }));

    return create;
  } catch (error) {
    return { error };
  }
}

export const getBookmarkedThreads = async (userId) => {
  try {
    const response = await client(`/get-threads-bookmark?bookmarkedBy=${userId}`);
    return response.data.threads; // Make sure you're returning the actual array
  } catch (error) {
    console.error("Error fetching bookmarked threads:", error);
    return []; // Safe fallback
  }
};



export const deleteComment = async(commentId)=>{
  try {
    const create = await client
      .delete(`/delete-comment/${commentId}`)
      // .then((response) => {
      //   console.log(response.data);
      //   if (response.data.status === "ok") {
      //     Alert.alert("comment deleted");
      //   } else {
      //     Alert.alert(JSON.stringify(response.data));
      //   }
      // })
      // .catch((error) => console.log({ error }));

    return create;
  } catch (error) {
    return { error };
  }
}

export const deleteQuestion = async(questionId)=>{
  try {
    const create = await client
      .delete(`/delete-question/${questionId}`)
      // .then((response) => {
      //   console.log(response.data);
      //   if (response.data.status === "ok") {
      //     Alert.alert("question deleted");
      //   } else {
      //     Alert.alert(JSON.stringify(response.data));
      //   }
      // })
      // .catch((error) => console.log({ error }));

    return create;
  } catch (error) {
    return { error };
  }
}

export const deleteCase = async(caseId)=>{
  try {
    const create = await client
      .delete(`/delete-case/${caseId}`)
    return create;
  } catch (error) {
    return { error };
  }
}


export const deleteThread = async(threadId)=>{
  try {
    const create = await client
      .delete(`/delete-thread/${threadId}`)
      .catch((error) => console.log({ error }));

    return create;
  } catch (error) {
    return { error };
  }
}

export const getFrontImage = async () => {
  try {
    // console.log("called")
      const data  = await client.get('/getImage');
      return data;
    } catch (error) {
      return { error };
    }
};

export const getStoryBillBoardImage = async () => {
  try {
    // console.log("called")
      const data  = await client.get('/getStoryImage');
      return data;
    } catch (error) {
      return { error };
    }
};

export const getUsers = async (userId) => {
  try {
    // console.log(userId)
      const response  = await client.get(`/chart-users/${userId}`);
      return response;
    } catch (error) {
      return { error };
    }
};

export const getHeaderChatInfo = async (userId) => {
  try {
    // console.log(userId)
      const response  = await client.get(`/get-users/${userId}`);
      return response;
    } catch (error) {
      return { error };
    }
};

export const fetchMessages = async (senderId, recepientId) => {
  try {
    // console.log(userId)
      const response  = await client.get(`/users/${senderId}/${recepientId}`);
      return response;
    } catch (error) {
      return { error };
    }
};


export const fetchInbox = async (senderId) => {
  try {
    // console.log(userId)
      const response  = await client.get(`/get-inbox/${senderId}`);
      return response;
    } catch (error) {
      return { error };
    }
};

export const MarkMessageRead = async (Ids) => {
  try {
    // console.log(userId)
      const response  = await client.post('/messages/mark-read',Ids);
      return response;
    } catch (error) {
      return { error };
    }
};



export const SendMessage = async (formData) => {
  // console.log("message", formData)
  try {
      const response  = await client.post('/message', formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      }
    });
      return response;
    } catch (error) {
      return { error };
    }
};

export const DeleteMessage = async (ids) => {
  // console.log("message", ids)
  try {
      const response  = await client.post('/delete-message', ids);
      return response;
    } catch (error) {
      return { error };
    }
};