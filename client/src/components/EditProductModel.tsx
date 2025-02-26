import { axiosInstance } from "@/axios/axiosInstance";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { toast } from "sonner";

interface FormModalProps {
  isOpen: boolean;
  //   onClose: () => void;
  //   title: string;
  editData: {
    name: string;
    price: number;
    category: string;
    inStock: boolean;
    image: File | null;
    _id:string
  };
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  refetch: () => void;
}

const EditProductModel = ({
  isOpen,
  //   onClose,
  //   title,
  editData,
  setIsOpen,
  refetch
}: FormModalProps) => {
  const [formData, setFormData] = useState<{
    name: string;
    price: number;
    category: string;
    inStock: boolean;
    image: File | null;
  }>(editData);

  useEffect(()=>{
    console.log(formData)
  })

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

      const res = await axiosInstance.put(`/products/${editData._id}`, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.status !== 200) {
        return toast.error("failed to create product");
      }
      toast.success("Product updated successfully");
      if (refetch) {
        refetch();
      }
    } catch (error) {
      toast.error("Error creating product");
      console.log(error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => setIsOpen(false)}>
      <DialogContent className="sm:max-w-[525px]  max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex gap-3 flex-col">
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
              {/* </form> */}
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditProductModel;
