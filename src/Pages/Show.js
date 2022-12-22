import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiGet } from "../misc/config";
const Show = () => {
  const { id } = useParams();
  const [show, setShow] = useState(null);
  useEffect(() => {
    apiGet(`/shows/${id}?embed[]=seasons&embed[]=cast`)
      .then((r) => r.json())
      .then((results) => {
        setShow(results);
      });
  }, [id]);

  return <div>this is Show page</div>;
};

export default Show;
