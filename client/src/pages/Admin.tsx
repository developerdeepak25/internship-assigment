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
import { useState } from "react";
const Admin = () => {
  const [formData, setFormData] = useState<{
    name: string;
    price: number;
    category: string;
    inStock: boolean;
    image: File | null;
  }>({
    name: "",
    price: 0,
    category: "",
    inStock: false,
    image: null,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("price", formData.price.toString());
      formDataToSend.append("category", formData.category);
      formDataToSend.append("inStock", formData.inStock.toString());
      if (formData.image) {
        formDataToSend.append("image", formData.image);
      }

      const res = await axiosInstance.post("/products", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.status !== 200) {
        return toast.error("failed to create product");
      }
      toast.success("Product created successfully");
      setFormData({
        name: "",
        price: 0,
        category: "",
        inStock: false,
        image: null,
      });
    } catch (error: any) {
      console.log(error);
      console.log(error.response.status);
      if (error.response.status === 401 && error.response.data.message) {
        return toast.error(error.response.data.message);
      }
      toast.error("Error creating product");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;

    if (type === "file") {
      const files = (e.target as HTMLInputElement).files;
      setFormData((prev) => ({
        ...prev,
        [name]: files ? files[0] : null,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]:
          type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
      }));
    }
  };

  return (
    <NarrowLayout>
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Create Product</CardTitle>
          <CardDescription>
            Enter product details to create a new product
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="Enter product name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                name="price"
                type="number"
                placeholder="Enter price"
                value={formData.price}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                name="category"
                placeholder="Enter category"
                value={formData.category}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="image">Product Image</Label>
              <Input
                id="image"
                name="image"
                type="file"
                accept="image/*"
                onChange={handleChange}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Input
                id="inStock"
                name="inStock"
                type="checkbox"
                className="w-4 h-4"
                checked={formData.inStock}
                onChange={handleChange}
              />
              <Label htmlFor="inStock">In Stock</Label>
            </div>
            <Button type="submit" className="w-full">
              Create Product
            </Button>
          </form>
        </CardContent>
      </Card>
    </NarrowLayout>
  );
};

export default Admin;
