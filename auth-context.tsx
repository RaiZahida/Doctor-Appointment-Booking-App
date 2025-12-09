import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { account, databases, ID, Query } from "./lib/appwrite";

interface User {
  $id: string;
  email: string;
  name?: string;
  role: "admin" | "user";
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

// Fixed: Removed syntax error in createContext
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // 🔄 Refresh user & ensure user doc exists
     // Updated refreshUser with better error handling
     const refreshUser = async () => {
      try {
        const acc = await account.get();
 
        let userDoc = await databases.listDocuments(
          "692923c0000e958a6532",
          "users",
          [Query.equal("userId", acc.$id)]
        );
 
        if (userDoc.documents.length === 0) {
          await new Promise(res => setTimeout(res, 1000)); // Wait for session
 
          // Try to check admin table, but handle permission errors
          let role: "admin" | "user" = "user"; // Default to user
          try {
            const adminCheck = await databases.listDocuments(
              "692923c0000e958a6532",
              "admin",
              [Query.equal("email", acc.email)]
            );
            if (adminCheck.documents.length > 0) {
              role = "admin";
            }
          } catch (adminErr: any) {
            console.log("Admin check failed (likely permissions):", adminErr.message);
            // Fallback: Keep role as "user" – or throw if you want to block
          }
 
          // Retry document creation
          let created = false;
          for (let attempt = 1; attempt <= 3; attempt++) {
            try {
              await databases.createDocument(
                "692923c0000e958a6532",
                "users",
                ID.unique(),
                {
                  userId: acc.$id,
                  name: acc.name,
                  email: acc.email,
                  role,
                },
                [
                  `read("user:${acc.$id}")`,
                  `write("user:${acc.$id}")`
                ]
              );
              created = true;
              break;
            } catch (createErr: any) {
              console.log(`Document creation attempt ${attempt} failed:`, createErr.message);
              if (attempt < 3) await new Promise(res => setTimeout(res, 1000));
            }
          }
 
          if (!created) {
            throw new Error("Failed to create user document after retries");
          }
 
          // Fetch again
          userDoc = await databases.listDocuments(
            "692923c0000e958a6532",
            "users",
            [Query.equal("userId", acc.$id)]
          );
        }
 
        // Set user state
        if (userDoc.documents.length > 0) {
          const doc = userDoc.documents[0];
          setUser({
            $id: doc.$id,
            email: doc.email,
            name: doc.name,
            role: doc.role,
          });
        } else {
          throw new Error("User document not found after creation");
        }
      } catch (err: any) {
        console.log("Refresh user error:", err.message);
        setUser(null);
        throw err;
      }
    };
    

  useEffect(() => {
    (async () => {
      try {
        await refreshUser();
      } catch (err) {
        console.log("Initial refresh failed:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // 🔐 LOGIN
  const login = async (email: string, password: string) => {
    try {
      // Delete any existing session
      try {
        await account.deleteSession("current");
        await new Promise(res => setTimeout(res, 500)); // wait for deletion
      } catch {}

      // Create new session
      await account.createEmailPasswordSession(email, password);

      // Refresh user state
      await refreshUser();
    } catch (err: any) {
      console.log("Login error:", err.message);
      throw new Error(err.message || "Login failed");
    }
  };

  // 📝 REGISTER
  const register = async (email: string, password: string, name?: string) => {
    try {
      // Create account
      await account.create(ID.unique(), email, password, name);

      // Delete existing session just in case
      try {
        await account.deleteSession("current");
        await new Promise(res => setTimeout(res, 500));
      } catch {}

      // Create session for new user
      await account.createEmailPasswordSession(email, password);

      // Refresh user & create user doc if needed
      await refreshUser();
    } catch (err: any) {
      console.log("Registration error:", err.message);
      throw new Error(err.message || "Registration failed");
    }
  };

  // 🚪 LOGOUT
  const logout = async () => {
    try {
      await account.deleteSession("current");
      setUser(null);
    } catch (err: any) {
      console.log("Logout error:", err.message);
      throw new Error(err.message || "Logout failed");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
