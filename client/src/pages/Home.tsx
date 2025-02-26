import { axiosInstance } from "@/axios/axiosInstance";
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import useStore from "@/store/store";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import EditProductModel from "@/components/EditProductModel";

const Home = () => {
  const {
    auth: { isAuthenticated },
  } = useStore();
  const [products, setProducts] = useState<any>();
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
    const [isModalOpen, setIsModalOpen] = useState(false);


  async function getProducts() {
    const res = await axiosInstance.get("/products");
    console.log(res.data.products);
    setProducts(res.data.products);
  }
  useEffect(() => {
    getProducts();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      setIsDeleting(true);
      const res = await axiosInstance.delete(`/products/${id}`);
      // .then((response) => response.json())
      // .then((data) => console.log("Deleted:", data))
      // .catch((error) => console.error("Error:", error));

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

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4">
      {products?.map((product) => (
        <>
          <Card key={product._id} className="p-4 shadow-md rounded-lg">
            <CardContent className="flex flex-col items-center">
              <img
                src={`http://localhost:3000/uploads/${product.image}`}
                alt={product.name}
                className="w-full h-40 object-cover rounded-md"
              />
              <h3 className="text-lg font-semibold mt-2">{product.name}</h3>
              <p className="text-gray-500">{product.price}</p>
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
          <EditProductModel editData={product} isOpen={isModalOpen} setIsOpen={setIsModalOpen} refetch={getProducts}/>
        </>
      ))}
    </div>
  );
};

export default Home;
