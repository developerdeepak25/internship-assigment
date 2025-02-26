"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { axiosInstance } from "@/axios/axiosInstance";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import useStore from "@/store/store";
import NarrowLayout from "@/components/NarrowLayout";

export default function Login() {
  const [formData, setFormData] = useState({
    name: "",
    password: "",
  });
  const navigate = useNavigate();
  const { login, auth } = useStore();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    setIsLoading(true);
    e.preventDefault();
    console.log("Form submitted:", formData);
    try {
      const res = await axiosInstance.post("/user/login", formData);
      console.log("login res", res);
      if (res.status !== 200) {
        return toast.error(res.data.message);
      }
      login();
      console.log(auth);
      toast.success(res.data.message);
      navigate("/admin");
    } catch (error:any) {
      console.log(error.response)
      if (error.response.data.message) {
        toast.error(error.response.data.message);
      }
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <NarrowLayout>
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Admin Login</CardTitle>
          <CardDescription>
            Enter your credentials to access the admin panel.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="Enter admin name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            <Button type="submit" className="w-full">
              {isLoading ? "Login...." : "Login"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </NarrowLayout>
  );
}
