import {
     collection,
     addDoc,
     getDocs,
     updateDoc,
     deleteDoc,
     doc,
     query,
     where,
     orderBy,
     serverTimestamp,
} from "firebase/firestore";

import { db, auth } from "../firebase";

// ✅ Add a task and include the user ID and createdAt timestamp
export const addTaskToFirestore = async (task) => {
     try {
          const user = auth.currentUser;
          if (!user) throw new Error("User not authenticated");

          const taskWithMeta = {
               ...task,
               createdBy: user.uid,
               createdAt: serverTimestamp(), // 👈 Required for sorting
          };

          const docRef = await addDoc(collection(db, "tasks"), taskWithMeta);
          return { id: docRef.id, ...taskWithMeta };
     } catch (error) {
          console.error("❌ Error adding task:", error);
          throw error;
     }
};

// ✅ Fetch only tasks created by the current user
export const getAllTasks = async () => {
     try {
          const user = auth.currentUser;
          console.log("Current user UID:", user?.uid);

          if (!user) throw new Error("User not authenticated");

          const q = query(
               collection(db, "tasks"),
               where("createdBy", "==", user.uid),
               orderBy("createdAt", "desc")
          );

          const snapshot = await getDocs(q);
          console.log("Task docs found:", snapshot.docs.length);

          return snapshot.docs.map((doc) => ({
               id: doc.id,
               ...doc.data(),
          }));
     } catch (error) {
          console.error("Error fetching tasks:", error);
          return [];
     }
};


// ✅ Update task by ID
export const updateTaskInFirestore = async (taskId, updatedTask) => {
     try {
          const taskRef = doc(db, "tasks", taskId);
          await updateDoc(taskRef, updatedTask);
     } catch (error) {
          console.error("❌ Error updating task:", error);
          throw error;
     }
};

// ✅ Delete task by ID
export const deleteTaskFromFirestore = async (taskId) => {
     try {
          const taskRef = doc(db, "tasks", taskId);
          await deleteDoc(taskRef);
     } catch (error) {
          console.error("❌ Error deleting task:", error);
          throw error;
     }
};

