import React, { useEffect } from "react";

const Room = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const name = searchParams.get("name");
  useEffect(() => {
    //initialize user to room
  }, [name]);
  return <div>hi{name}</div>;
};

export default Room;
