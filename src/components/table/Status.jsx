import { Badge } from "@windmill/react-ui";

const Status = ({ status }) => {
  return (
    <>
      <span className="font-serif">
        {(status === "Pending" || status === "Inactive") && (
          <Badge type="warning">{status}</Badge>
        )}
        {status === "Waiting for Password Reset" && (
          <Badge type="warning">{status}</Badge>
        )}
        {status === "Processing" && <Badge>{status}</Badge>}
        {status === "Shipped" && (
          <Badge className="dark:bg-blue-900 bg-blue-100 text-blue-700">
            {status}
          </Badge>
        )}
        {(status === "Delivered" || status === "Active") && (
          <Badge type="success">{status}</Badge>
        )}
        {(status === "Cancel" || status === "Cancelled") && (
          <Badge type="danger">{status}</Badge>
        )}
        {status === "Refunded" && (
          <Badge className="dark:bg-purple-900 bg-purple-100 text-purple-700">
            {status}
          </Badge>
        )}
        {status === `POS-Completed` && (
          <Badge className="dark:bg-teal-900 bg-teal-100">{status}</Badge>
        )}
      </span>
    </>
  );
};

export default Status;
