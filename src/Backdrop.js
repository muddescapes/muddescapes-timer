import "./Backdrop.css";

function Backdrop(props) {

    return <div
          className="opaque-screen"
          onClick={props.onClickBackdrop}
        >
        </div>
}

export default Backdrop;
