import { axiosInstance } from "@/axios/axiosInstance";
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import useStore from "@/store/store";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import EditProductModel from "@/components/EditProductModel";
import { NavLink } from "react-router-dom";

const Home = () => {
  const {
    auth: { isAuthenticated },
  } = useStore();
  const [products, setProducts] = useState<any>([]);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  async function getProducts() {
    try {
      const res = await axiosInstance.get("/products");
      setProducts(res.data.products);
    } catch (error) {
      toast.error("Failed to fetch products");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getProducts();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      setIsDeleting(true);
      const res = await axiosInstance.delete(`/products/${id}`);

      if (res.status !== 200) {
        return toast.error("some error come");
      }
      toast.success("product deleted sucessfully");
      getProducts();
      return;
    } catch (error) {
      console.log(error);
      toast.error("can't delete the product");
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <div className="text-xl text-gray-600">Loading products...</div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <h2 className="text-2xl font-semibold text-gray-600">
          No products available
        </h2>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4">
      {products.map((product) => (
        <>
          <Card key={product._id} className="p-4 shadow-md rounded-lg">
            <CardContent className="flex flex-col items-end">
              <div className="border-b w-full mb-3 pb-3">
                <NavLink
                  to={`/product/${product._id}`}
                  className={"block w-full "}
                >
                  <img
                    src={`http://localhost:3000/uploads/${product.image}`}
                    alt={product.name}
                    className="w-full h-40 object-cover rounded-md"
                  />
                  <h3 className="text-lg font-semibold mt-2">{product.name}</h3>
                  <p className="text-gray-500">{product.price}</p>
                </NavLink>
              </div>
              {isAuthenticated && (
                <div className="mt-2 flex gap-2">
                  <Button
                    onClick={() => handleDelete(product._id)}
                    variant="destructive"
                  >
                    {isDeleting ? "Deleting..." : "Delete"}{" "}
                  </Button>
                  <Button
                    onClick={() => setIsModalOpen(true)}
                    variant="default"
                  >
                    Update
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <EditProductModel
            editData={product}
            isOpen={isModalOpen}
            setIsOpen={setIsModalOpen}
            refetch={getProducts}
          />
        </>
      ))}
    </div>
  );
};

export default Home;
