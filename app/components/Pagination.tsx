import type { ProductMeta } from "../share/api";

type Props = {
  meta: ProductMeta;
  onPrev: () => void;
  onNext: () => void;
};

export default function Pagination({ meta, onPrev, onNext }: Props) {
  return (
    <div className="flex items-center justify-between">
      <p className="text-sm text-gray-600">
        Page {meta.page} of {meta.totalPages} | Total {meta.total}
      </p>

      <div className="flex gap-2">
        <button
          disabled={!meta.hasPrev}
          onClick={onPrev}
          className="rounded-lg border px-4 py-2 disabled:opacity-50"
        >
          Prev
        </button>

        <button
          disabled={!meta.hasNext}
          onClick={onNext}
          className="rounded-lg border px-4 py-2 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}