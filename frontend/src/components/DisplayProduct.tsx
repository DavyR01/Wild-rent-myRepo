import React from 'react';
import Link from "next/link";
import axios from "axios";
import ProductCard, { ProductCardProps } from "./ProductCard";

type DisplayProductsType = {
  products: ProductCardProps[];
};

const DisplayProducts = ({ products }: DisplayProductsType) => {
  return (
    <>
      <section>
        {products.map((product) => (
          <div key={product.id}>
            <Link href={`/product/${product.id}`}>
              <ProductCard
                name={product.name}
                description={product.description}
                price={product.price}
                quantity={product.quantity}
                location={product.location}
                category={product.category}
              />
            </Link>
            <button
              onClick={() => {
                console.log("delete");
                //axios.delete(`http://localhost:4000/product/${product.id}`);
              }}
            >
              Delete
            </button>
          </div>
        ))}
      </section>
    </>
  );
};

export default DisplayProducts;