import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { decrementCounter, incrementCounter } from "./counterSlice";

function Contact() {
  const { title, data } = useAppSelector((state) => state.counter);
  const dispatch = useAppDispatch();

  return (
    <div>
      <h1>{title}</h1>
      <p>{data}</p>
      <button onClick={() => dispatch(incrementCounter(1))}>Increment</button>
      <button onClick={() => dispatch(decrementCounter(1))}>Decrement</button>
      <button onClick={() => dispatch(incrementCounter(10))}>
        Increment 10
      </button>
    </div>
  );
}

// //map state to props
// const mapStateToProps = (state: CounterState) => ({
//   title: state.title,
//   data: state.data,
// });

// //map dispatch to props
// const mapDispatchToProps = (dispatch: any) => ({
//   increment: () => dispatch({ type: "INCREMENT_COUNTER" }),
//   decrement: () => dispatch({ type: "DECREMENT_COUNTER" }),
// });

// //connect to redux
// export default connect(mapStateToProps, mapDispatchToProps)(Contact);

export default Contact;
