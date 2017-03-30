let React = require('react');
let CollageSelector = require('./CollageSelector.jsx');
let FileForm = require('./FileForm.jsx');

class InputForm extends React.Component {

   constructor(props) {
      super(props);

      this.state = {
         fileName: '',
         noFile: this.props.noFile
      };
   }

   componentWillReceiveProps(nextProps) {
      this.setState({
         noFile: nextProps.noFile
      });
   }

   render() {
      return (
         <div id="input-form-wrapper">
            <div className="mdl-grid">
               <CollageSelector />
               <FileForm noFile={this.state.noFile}/>
            </div>
            <div className="mdl-grid">
               <div id="check-button-wrapper" className="mdl-cell mdl-cell--12-col">
                  <button id="check-button" className="mdl-button mdl-js-button mdl-button--raised mdl-button--colored">
                     Check!
                  </button>
               </div>
            </div>
         </div>
      );
   }

}

module.exports = InputForm;
