'use client';

import { useState, useTransition } from 'react';
import { Trash2 } from 'lucide-react';
import { deleteProduct } from '@/lib/actions/products';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function DeleteProductButton({
  productId,
  productName,
}: {
  productId: string;
  productName: string;
}) {
  const [confirming, setConfirming] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleDelete = () => {
    startTransition(async () => {
      try {
        await deleteProduct(productId);
        toast.success(`"${productName}" deleted`);
        router.refresh();
      } catch {
        toast.error('Failed to delete product');
      } finally {
        setConfirming(false);
      }
    });
  };

  if (confirming) {
    return (
      <div className="flex items-center gap-1">
        <button
          onClick={handleDelete}
          disabled={isPending}
          className="px-2 py-1 bg-red-500 text-white font-sans text-2xs hover:bg-red-600 transition-colors disabled:opacity-50"
        >
          {isPending ? '…' : 'Confirm'}
        </button>
        <button
          onClick={() => setConfirming(false)}
          className="px-2 py-1 border border-gray-200 font-sans text-2xs text-charcoal-muted hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="p-1.5 text-charcoal-muted hover:text-red-500 hover:bg-red-50 transition-colors"
      aria-label="Delete"
    >
      <Trash2 size={13} />
    </button>
  );
}
