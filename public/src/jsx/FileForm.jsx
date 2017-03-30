let React = require('react');
let $ = require('jquery');

class FileForm extends React.Component {

   constructor(props) {
      super(props);
      this.state = {
         fileName: ''
      };
      this.selectFile = this.selectFile.bind(this);
      this.changeText = this.changeText.bind(this);
   }

   selectFile() {
      let selecter = document.getElementById('fileSelecter');
      selecter.click();
      selecter.onchange = this.changeText;
   }

   changeText() {
      // console.log("file is selected: " + $('#fileSelecter')[0].files[0].name);
      //noinspection JSUnresolvedVariable
      this.setState({
         fileName: $('#fileSelecter')[0].files[0].name,
      });
   }

   render() {
      return (
         <div className="mdl-cell mdl-cell--6-col">
            <p>2. 履修科目データのCSVを選択します</p>
            <input type="file" id="fileSelecter" className="form-contorl" style={{display: 'none'}}/>
            <div id="file-input-wrapper">
               <button type="button" id="file-select-icon" className="mdl-button mdl-js-button"
                       onClick={this.selectFile}><i
                  className="material-icons">file_upload</i></button>
               <input type="text" id="fileName" placeholder="Select file ..." readOnly
                      value={this.state.fileName} />
            </div>
         </div>
      );
   }
}

module.exports = FileForm;
