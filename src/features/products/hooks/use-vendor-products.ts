'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { useCurrentUser } from '@/features/auth/hooks/use-current-user';
import { ApiError } from '@/lib/api/error';
import { ProductsQuery } from '@/types/catalog';
import {
  CreateProductInput,
  UpdateProductInput,
  VariantInput,
  vendorProductsApi,
} from '../api/vendor-products.api';

const vendorProductsKey = (query: ProductsQuery = {}) => ['vendor-products', query] as const;

export function useVendorProducts(query: ProductsQuery = {}) {
  const { user, isAuthenticated } = useCurrentUser();
  return useQuery({
    queryKey: vendorProductsKey(query),
    queryFn: () => vendorProductsApi.listMine(query),
    enabled: isAuthenticated && user?.role === 'vendor',
    placeholderData: (previous) => previous,
  });
}

export function useVendorProduct(id: string) {
  return useQuery({
    queryKey: ['vendor-products', id],
    queryFn: () => vendorProductsApi.getMine(id),
    enabled: !!id,
  });
}

function invalidateProducts(queryClient: ReturnType<typeof useQueryClient>, id?: string) {
  queryClient.invalidateQueries({ queryKey: ['vendor-products'] });
  if (id) queryClient.invalidateQueries({ queryKey: ['vendor-products', id] });
}

export function useCreateVendorProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateProductInput) => vendorProductsApi.create(input),
    onSuccess: () => {
      invalidateProducts(queryClient);
      toast.success('Product created');
    },
    onError: (error) => {
      toast.error(error instanceof ApiError ? error.message : 'Something went wrong');
    },
  });
}

export function useUpdateVendorProduct(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateProductInput) => vendorProductsApi.update(id, input),
    onSuccess: () => {
      invalidateProducts(queryClient, id);
      toast.success('Product updated');
    },
    onError: (error) => {
      toast.error(error instanceof ApiError ? error.message : 'Something went wrong');
    },
  });
}

export function useDeleteVendorProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => vendorProductsApi.remove(id),
    onSuccess: () => {
      invalidateProducts(queryClient);
      toast.success('Product deleted');
    },
    onError: (error) => {
      toast.error(error instanceof ApiError ? error.message : 'Something went wrong');
    },
  });
}

export function useAddVariant(productId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: VariantInput) => vendorProductsApi.addVariant(productId, input),
    onSuccess: () => {
      invalidateProducts(queryClient, productId);
      toast.success('Variant added');
    },
    onError: (error) => {
      toast.error(error instanceof ApiError ? error.message : 'Something went wrong');
    },
  });
}

export function useUpdateVariant(productId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ variantId, input }: { variantId: string; input: Partial<VariantInput> }) =>
      vendorProductsApi.updateVariant(productId, variantId, input),
    onSuccess: () => {
      invalidateProducts(queryClient, productId);
      toast.success('Variant updated');
    },
    onError: (error) => {
      toast.error(error instanceof ApiError ? error.message : 'Something went wrong');
    },
  });
}

export function useRemoveVariant(productId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (variantId: string) => vendorProductsApi.removeVariant(productId, variantId),
    onSuccess: () => {
      invalidateProducts(queryClient, productId);
      toast.success('Variant removed');
    },
    onError: (error) => {
      toast.error(error instanceof ApiError ? error.message : 'Something went wrong');
    },
  });
}

export function useAdjustStock(productId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ variantId, stockQuantity }: { variantId: string; stockQuantity: number }) =>
      vendorProductsApi.adjustStock(productId, variantId, stockQuantity),
    onSuccess: () => {
      invalidateProducts(queryClient, productId);
      toast.success('Stock updated');
    },
    onError: (error) => {
      toast.error(error instanceof ApiError ? error.message : 'Something went wrong');
    },
  });
}
