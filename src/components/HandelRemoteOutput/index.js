import React from "react";
import Loading from "../Loading";
import EmptyData from "../EmptyData";

function HandelRemoteLayout({ children }) {
  return <>{children}</>;
}

const Pending = ({ isPending }) => {
  return <>{isPending && <Loading />}</>;
};

const Empty = ({ isEmpty, message }) => {
  return <>{isEmpty && <EmptyData message={message} />}</>;
};

const Fullfilled = ({ isFullfilled, children }) => {
  return <>{isFullfilled && children}</>;
};

const Rejected = ({ isRejected, message }) => {
  return <>{isRejected && "something went rong"}</>;
};
HandelRemoteLayout.Pending = Pending;
HandelRemoteLayout.Empty = Empty;
HandelRemoteLayout.Fullfilled = Fullfilled;
HandelRemoteLayout.Rejected = Rejected;

export default HandelRemoteLayout;
