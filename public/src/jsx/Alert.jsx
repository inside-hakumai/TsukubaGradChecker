let React = require('react');

class Alert extends React.Component {

   constructor(props) {
      super(props);
      this.state = {
         noFile: this.props.noFile
      };
   }

   componentWillReceiveProps(nextProps) {
      // console.log("Alert's props is updated: %O", nextProps);
      this.setState({
         noFile: nextProps.noFile
      });
   }

   render() {
      if (this.state.noFile) {
         return (
            <div className="alert alert-danger">
               <strong>Oh snap!</strong> <a href="#" className="alert-link">Change a few things up</a> and try
               submitting
               again.
            </div>
         );
      } else {
         return (
            <div />
         );
      }
   }
}
