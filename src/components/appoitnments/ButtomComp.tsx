import { DialogActions } from "@mui/material";
import React from "react";

interface props {
  state: "modified" | "disabled" | "create";
  close: () => void;
}

function ButtomComp(props: props) {
  return (
    <div className="w-full mt-8 flex items-center justify-end">
      <DialogActions>
        <button
          className="btn btn-outline capitalize rounded-full btn-neutral"
          onClick={props.close}
        >
          Annuler
        </button>
      </DialogActions>
    </div>
  );
}

export default ButtomComp;
