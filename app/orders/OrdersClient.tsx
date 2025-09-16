"use client";

import React, { useState, useEffect } from "react";
import {
  fetchOrders,
  downloadReceipt,
  sendReview,
} from "@/utils/frontendAPIs/orders";
import { OrderItem } from "@/utils/models";
import {
  StarIcon,
  DocumentArrowDownIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderItem: OrderItem | null;
  onSubmit: (stars: number, comment: string, files: File[]) => void;
  loading: boolean;
}

const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  onClose,
  orderItem,
  onSubmit,
  loading,
}) => {
  const [stars, setStars] = useState(0);
  const [comment, setComment] = useState("");
  const [files, setFiles] = useState<File[]>([]);

  useEffect(() => {
    if (isOpen) {
      setStars(0);
      setComment("");
      setFiles([]);
    }
  }, [isOpen]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (stars > 0) {
      onSubmit(stars, comment, files);
    }
  };

  if (!isOpen || !orderItem) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">Leave a Review</h2>
          <div className="mb-4">
            <h3 className="font-medium">{orderItem.name}</h3>
            <p className="text-sm text-gray-600">{orderItem.description}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Rating</label>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setStars(star)}
                    className="focus:outline-none"
                  >
                    {star <= stars ? (
                      <StarIconSolid className="h-6 w-6 text-yellow-400" />
                    ) : (
                      <StarIcon className="h-6 w-6 text-gray-300" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Comment</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Share your experience with this product..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Photos (Optional)
              </label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex space-x-3">
              <button
                type="submit"
                disabled={loading || stars === 0}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Submitting..." : "Submit Review"}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default function OrdersClient() {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [downloading, setDownloading] = useState<string | null>(null);
  const [reviewModal, setReviewModal] = useState<{
    isOpen: boolean;
    orderItem: OrderItem | null;
  }>({ isOpen: false, orderItem: null });
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    fetchOrdersData();
  }, []);

  const fetchOrdersData = async () => {
    try {
      setLoading(true);
      const response = await fetchOrders();
      if (response.success && response.data) {
        setOrders(response.data);
      } else {
        setError(response.message || "Failed to fetch orders");
      }
    } catch (err) {
      setError("An error occurred while fetching orders");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReceipt = async (iid: string) => {
    if (downloading === iid) return;

    setDownloading(iid);
    try {
      const blob = await downloadReceipt(iid);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `receipt-${iid}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error("Download failed:", err);
    } finally {
      setDownloading(null);
    }
  };

  const handleSubmitReview = async (
    stars: number,
    comment: string,
    files: File[]
  ) => {
    if (!reviewModal.orderItem) return;

    setSubmittingReview(true);
    try {
      const formData = new FormData();
      formData.append("stars", stars.toString());
      formData.append("comment", comment);
      formData.append("iid", reviewModal.orderItem.pid);
      formData.append("oid", reviewModal.orderItem._id);

      files.forEach((file) => {
        formData.append("files", file);
      });

      const response = await sendReview(formData);
      if (response.success) {
        // Update the order item to mark as reviewed
        setOrders(
          orders.map((item) =>
            item._id === reviewModal.orderItem!._id
              ? { ...item, reviewed: true }
              : item
          )
        );
        setReviewModal({ isOpen: false, orderItem: null });
      } else {
        console.error("Review submission failed:", response.message);
      }
    } catch (err) {
      console.error("Review submission error:", err);
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={fetchOrdersData}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <svg
            className="mx-auto h-24 w-24"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No orders found
        </h3>
        <p className="text-gray-600 mb-6">You haven't placed any orders yet.</p>
        <a
          href="/products"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Start Shopping
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {orders.map((order) => (
        <div key={order._id} className="border border-gray-200 rounded-lg p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start space-x-4">
              <img
                src={order.img}
                alt={order.name}
                className="w-20 h-20 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h3 className="text-lg font-medium text-gray-900">
                  {order.name}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {order.description}
                </p>
                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                  {order.size && <span>Size: {order.size}</span>}
                  {order.color && <span>Color: {order.color}</span>}
                  {order.gender && <span>Gender: {order.gender}</span>}
                </div>
                {order.selectedOption && (
                  <p className="text-sm text-gray-500 mt-1">
                    Option: {order.selectedOption}
                  </p>
                )}
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold text-gray-900">
                KES {order.price.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500">Qty: {order.amount}</p>
              {order.status && (
                <span
                  className={`inline-block px-2 py-1 text-xs rounded-full mt-2 ${
                    order.status === "delivered"
                      ? "bg-green-100 text-green-800"
                      : order.status === "shipped"
                      ? "bg-blue-100 text-blue-800"
                      : order.status === "processing"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {order.status}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => handleDownloadReceipt(order._id)}
                disabled={downloading === order._id}
                className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
              >
                <DocumentArrowDownIcon className="h-4 w-4" />
                <span>
                  {downloading === order._id
                    ? "Downloading..."
                    : "Download Receipt"}
                </span>
              </button>

              {!order.reviewed && (
                <button
                  onClick={() =>
                    setReviewModal({ isOpen: true, orderItem: order })
                  }
                  className="flex items-center space-x-2 px-3 py-2 text-sm text-blue-600 hover:text-blue-800 border border-blue-300 rounded-md hover:bg-blue-50"
                >
                  <StarIcon className="h-4 w-4" />
                  <span>Leave Review</span>
                </button>
              )}

              {order.reviewed && (
                <span className="flex items-center space-x-2 px-3 py-2 text-sm text-green-600">
                  <StarIconSolid className="h-4 w-4" />
                  <span>Reviewed</span>
                </span>
              )}
            </div>

            <div className="text-sm text-gray-500">Order ID: {order._id}</div>
          </div>
        </div>
      ))}

      <ReviewModal
        isOpen={reviewModal.isOpen}
        onClose={() => setReviewModal({ isOpen: false, orderItem: null })}
        orderItem={reviewModal.orderItem}
        onSubmit={handleSubmitReview}
        loading={submittingReview}
      />
    </div>
  );
}
