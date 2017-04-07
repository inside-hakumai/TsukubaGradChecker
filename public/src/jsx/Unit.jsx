let React = require('react');

class Unit extends React.Component {

   // this.props.data = {id, match, name, number}

   constructor(props) {
      super(props);
      this.state = {
         credits: []
      };
      this.numToString = this.numToString.bind(this);
      this.hasRange = this.hasRange.bind(this);
   }

   get id() {
      return this.props.data.id;
   }

   get match() {
      return this.props.data.match;
   }

   get code() {
      return this.props.data.code;
   }

   get name() {
      return this.props.data.name;
   }

   get number() {
      if (this.props.data.number.hasRange) {
         return parseFloat(this.props.data.number['maximum']);
      } else {
         return parseFloat(this.props.data.number['number']);
      }
   }

   /*
    addCredit(credit) {
    this.setState({
    credits: this.state.credits.concat(credit)
    });
    }
    */

   hasRange() {
      return Boolean(this.props.data.number.hasRange);
   }

   numToString() {
      // console.log(this.props.data.number.hasRange);
      if (this.props.data.number.hasRange) {
         return (this.props.data.number['minimum'] + ' ~ ' + this.props.data.number['maximum']);
      } else {
         return this.props.data.number['number'];
      }
   }

   allocatedCreditSum() {
      let sum = 0;
      let length = this.props.data['allocatedCredit'].length;
      for (let i = 0; i < length; i++) {
         sum += parseFloat(this.props.data['allocatedCredit'][i].number);
      }
      return sum;
   }


   render() {

      if (this.props.determined) {
         let credit = this.props.data['allocatedCredit'][0];
         let total;
         let status;
         if (credit) {
            if (credit.total == '履修中') {
               total = '履修中';
               status = 'learning';
            } else {
               total = '習得済';
               status = '';
            }
         } else {
            total = '未習得';
            status = 'unacquired';
         }
         return (
            <tr className={status} key={'unit' + this.id}>
               <td className="mdl-data-table__cell--non-numeric" key={'unit' + this.id + '-name'}>{this.name}</td>
               <td key={'unit' + this.id + '-number'}>{this.number}</td>
               <td key={'unit' + this.id + '-total'}>{total}</td>
            </tr>
         );
      } else {
         let status = '';
         if (!this.hasRange()) {
            if (this.number <= this.allocatedCreditSum()) {
               status = 'filled';
            } else {
               status = 'unfilled';
            }
         } else {
            if (this.number <= this.allocatedCreditSum()) {
               status = 'filled';
            }
         }
         return (
            <table className="mdl-data-table mdl-js-data-table mdl-shadow--2dp result-table">
               <thead className={status}>
               <tr>
                  <th className="mdl-data-table__cell--non-numeric col-header"
                      colSpan="2">{this.props.data['name']}</th>
               </tr>
               <tr>
                  <th className="mdl-data-table__cell--non-numeric col-header" colSpan="2">取得単位数
                     : {this.allocatedCreditSum()}
                     / 必要単位数 : {this.numToString()}</th>
               </tr>
               {
                  (() => {
                     if (this.props.data['allocatedCredit'].length != 0) {
                        return (
                           <tr>
                              <th className="mdl-data-table__cell--non-numeric">単位名</th>
                              <th>単位数</th>
                           </tr>
                        );
                     }
                  })()
               }
               </thead>
               <tbody>
               {
                  (() => {
                     if (this.props.data['allocatedCredit'].length == 0) {
                        return (
                           <tr>
                              <td className="mdl-data-table__cell--non-numeric" colSpan="2">割り当て単位なし</td>
                           </tr>
                        );
                     }
                  })()
               }
               {
                  this.props.data['allocatedCredit'].map(function (credit) {
                     // console.info(credit);
                     return (
                        <tr key={credit.id + credit.code}>
                           <td className="mdl-data-table__cell--non-numeric"
                               key={credit.id + credit.code + '-name'}>{credit.title}</td>
                           <td key={credit.id + credit.code + '-number'}>{credit.number}</td>
                        </tr>
                     );
                  })
               }
               </tbody>
            </table>
            /*
             <div id={"row-unit" + this.props.data["id"]} className="item-unit">
             <div className="row">
             <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">{this.props.data["name"]}</div>
             <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">{this.numToString()}</div>
             </div>
             <div className="allocated-credit">
             {
             this.props.data["allocatedCredit"].map(function (credit) {
             return (
             <div key={credit.id + credit.code} className="row">
             <div className="col-xs-offset-1 col-sm-offset-1 col-xs-4 col-sm-4 col-md-4 col-lg-4" key={credit.id + credit.code + "-name"}>{credit.title}</div>
             <div className="col-xs-4 col-sm-4 col-md-4 col-lg-4" key={credit.id + credit.code + "-number"}>{credit.number}</div>
             </div>
             );
             })
             }
             </div>
             </div>
             */
         );
      }
   }
}

module.exports = Unit
