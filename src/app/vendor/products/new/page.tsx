import { VendorProductCreateForm } from '@/features/products/components/vendor-product-create-form';

export default function NewVendorProductPage() {
  return (
    <div className="max-w-2xl space-y-4">
      <h2 className="text-lg font-semibold">Add Product</h2>
      <VendorProductCreateForm />
    </div>
  );
}
