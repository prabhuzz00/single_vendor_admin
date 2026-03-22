import React, { useContext, useState, useEffect } from "react";
import { Select } from "@windmill/react-ui";

//internal import
import OrderServices from "@/services/OrderServices";
import { notifySuccess, notifyError } from "@/utils/toast";
import { SidebarContext } from "@/context/SidebarContext";

const SelectStatus = ({ id, order }) => {
  const { setIsUpdate } = useContext(SidebarContext);
  const [selectedStatus, setSelectedStatus] = useState(order?.status || "");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setSelectedStatus(order?.status || "");
  }, [order?.status]);

  const isDirty = selectedStatus !== order?.status;

  const handleSave = () => {
    if (!isDirty) return;
    setSaving(true);
    OrderServices.updateOrder(id, { status: selectedStatus })
      .then((res) => {
        notifySuccess(res.message);
        setIsUpdate(true);
      })
      .catch((err) => notifyError(err.message))
      .finally(() => setSaving(false));
  };

  return (
    <>
      {order?.cancellationRequested && (
        <p className="text-xs text-red-500 mb-1 font-medium">
          ⚠ Customer requested cancellation
        </p>
      )}
      <div className="flex items-center gap-1.5">
        <Select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="h-8"
        >
          <option value="Pending">Pending</option>
          <option value="Processing">Processing</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
          <option value="Refunded">Refunded</option>
        </Select>
        {isDirty && (
          <button
            onClick={handleSave}
            disabled={saving}
            className="h-8 px-2.5 text-xs font-semibold text-white bg-emerald-500 hover:bg-emerald-600 disabled:opacity-60 rounded whitespace-nowrap"
          >
            {saving ? "..." : "Save"}
          </button>
        )}
      </div>
    </>
  );
};

export default SelectStatus;
