"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { axiosInstance } from "@/axios/axiosInstance";
import { Loader2 } from "lucide-react";
import { useParams } from "react-router-dom";

interface Product {
  price: number;
  name: string;
  inStock: boolean;
  image: string;
  category: string;
}

export default function SingleProduct() {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const {id} = useParams();

  useEffect(
    ()=>{
console.log(product)
    }
  )

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // Replace '/api/product' with your actual API endpoint
        const res = await axiosInstance.get(`/products/${id}`);
        console.log("🚀 ~ fetchProduct ~ res:", res)
        if (res.status !== 200) {
          setError("Error fetching product details");
        }
        // const data = await response.json();
        setProduct(res.data.product);
      } catch (err) {
        setError("Error fetching product details");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <Card>
          <CardContent>
            <p className="text-red-500">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">{product?.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-1/2">
              <img
                src={`http://localhost:3000/uploads/${product?.image}`}
                alt={product?.name}
                className="rounded-lg object-cover w-full h-64 md:h-auto"
              />
            </div>
            <div className="w-full md:w-1/2 space-y-4">
              <p className="text-3xl font-bold">${product?.price.toFixed(2)}</p>
              <Badge variant={product?.inStock ? "default" : "secondary"}>
                {product?.inStock ? "In Stock" : "Out of Stock"}
              </Badge>
              <p className="text-muted-foreground">
                Category: {product?.category}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
