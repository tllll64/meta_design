import DemoApp from "@/apps/demo/DemoApp";
import ProductApp from "@/apps/product/ProductApp";

export default function App() {
  const mode = import.meta.env.VITE_APP_MODE;
  if (mode === "product") return <ProductApp />;
  return <DemoApp />;
}
