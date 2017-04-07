/* global $, React, ReactDOM */ // avoid ESList warning

window.jQuery = window.$ = require('jquery');
window.$.velocity = require('velocity-animate/velocity.js');
let React = require('react');
let ReactDOM = require('react-dom');
let FileForm = require('./FileForm.jsx');
let InputForm = require('./InputForm.jsx');
let CollageSelector = require('./CollageSelector.jsx');
let LargeCategory = require('./LargeCategory.jsx');

const LARGE_CATEGORY = ['MS', 'FSM', 'GFS_common', 'GFS_related'];
const LARGE_CATEGORY_NAME = ['専門科目', '専門基礎科目', '基礎科目(共通科目)', '基礎科目(関連科目)'];
const SMALL_CATEGORY = ['required', 'elective', 'free'];
const SMALL_CATEGORY_NAME = ['必修科目', '選択科目', '自由科目'];

var user_grade_global = null;

$(document).ready(function () {
   /*
    ReactDOM.render(
    <LargeCategory type={0}/>,
    document.querySelector('#resultWrapper')
    );
    */

   ReactDOM.render(
      <InputForm noFile={false}/>,
      document.querySelector('#gettingstarted .react-render-area')
   );

   $('#check-button').click(function () {
      var user_grade;

      if ($('#fileSelecter')[0].files.length == 1) {
         // console.log($('#fileSelecter')[0].files[0]);
         user_grade = new Grade($('#fileSelecter')[0].files[0]);
         user_grade.readGradeFile().then(function () {
            // console.log(user_grade);
            ReactDOM.render(
               <InputForm noFile={false}/>,
               document.querySelector('#gettingstarted .react-render-area')
            );
            ReactDOM.render(
               <Requirement collage={$('#collage').val()}/>,
               document.querySelector('#result .react-render-area')
            );
         });
      } else {
         // console.log(document.querySelectorAll('.input-form'));
         ReactDOM.render(
            <InputForm noFile={true}/>,
            document.querySelector('#gettingstarted .react-render-area')
         );
         /*
          ReactDOM.render(
          <Alert />,
          document.querySelectorAll('.input-form')[1]
          );
          */
      }
      user_grade_global = user_grade;
   });

});

class Requirement extends React.Component {

   constructor(props) {
      super(props);
      this.unitList = [];
      this.state = {
         groupings: [],
         tree: {
            MS: {
               required: [],
               elective: [],
               free: [],
               determined: [],
               addup: []
            },
            FSM: {
               required: [],
               elective: [],
               free: [],
               determined: [],
               addup: []
            },
            GFS_common: {
               required: [],
               elective: [],
               free: [],
               determined: [],
               addup: []
            },
            GFS_related: {
               required: [],
               elective: [],
               free: [],
               determined: [],
               addup: []
            },
            addupList: {
               number: null,
               units: [],
               description: null
            }
         }
      };

      this.readRequirementData = this.readRequirementData.bind(this);
      this.parseXML2JSON = this.parseXML2JSON.bind(this);
      this.verify = this.verify.bind(this);
      this.isInAddupList = this.isInAddupList.bind(this);
      this.calAddupList = this.calAddupList.bind(this);

      var element = document.getElementById('grey_panel');
      new Promise(function (resolve) {
         element.style.display = 'block';
         resolve();
      }).then(() => {
         return (this.readRequirementData(this.props.collage));
      }).then((reqText) => {
         return (this.parseXML2JSON(reqText));
      }).then((unitTreeAndList) => {
         // console.log(unitTreeAndList[0], unitTreeAndList[1]);
         this.verify(user_grade_global, unitTreeAndList[0], unitTreeAndList[1]);
      }).then(() => {
         console.log(this.calAddupList());
         return new Promise((resolve) => {
            element.style.display = 'none';
            resolve();
         });
      }).then(() => {
         $('#gettingstarted').velocity({
            height: '0',
            padding: '0',
            margin: '0'
         }, {
            easing: 'Linear',
            duration: 700,
            delay: 10,
            complete: () => {
               var resultHeight = ($('#result .content-wrapper').height() + 60);
               $('#result').velocity({
                  easing: 'Linear',
                  height: resultHeight,
                  padding: '10px'
               }, {
                  duration: 2000,
                  complete: () => {
                     document.getElementById('result').style.height = 'auto';
                  }
               });
            }
         });
      });
   }

   render() {
      return (
         <div className='result-requirement'>
            <LargeCategory units={this.state.tree['MS']} calAddupList={this.calAddupList}
                           isInAddupList={this.isInAddupList}
                           type={0}/>
            <LargeCategory units={this.state.tree['FSM']} calAddupList={this.calAddupList}
                           isInAddupList={this.isInAddupList} type={1}/>
            <LargeCategory units={this.state.tree['GFS_common']} calAddupList={this.calAddupList}
                           isInAddupList={this.isInAddupList} type={2}/>
            <LargeCategory units={this.state.tree['GFS_related']} calAddupList={this.calAddupList}
                           isInAddupList={this.isInAddupList} type={3}/>
         </div>
      );
   }

   readRequirementData(collageString) {
      return new Promise(function (resolve) {
         $.ajax({
            url: '/endpoint',
            type: 'GET'
         }).done(function (_csrf) {
            $.ajax({
               url: '/endpoint',
               type: 'POST',
               data: {
                  collage: collageString,
                  _csrf: _csrf
               },
               dataType: 'text'
            }).done(function (reqText) {
               resolve(reqText);
               /*
                this.setState({
                classification: this.parseXML2JSON(reqText)
                });
                */
            });
         });
      });
   }

   parseXML2JSON(xmlText) {
      return new Promise(function (resolve) {
         let parser = new DOMParser();
         let dom = parser.parseFromString(xmlText.toString(), 'text/xml');

         var groupingList = new Array();
         var unitTree = {
            MS: {
               required: [],
               elective: [],
               free: [],
               determined: [],
               addup: []
            },
            FSM: {
               required: [],
               elective: [],
               free: [],
               determined: [],
               addup: []
            },
            GFS_common: {
               required: [],
               elective: [],
               free: [],
               determined: [],
               addup: []
            },
            GFS_related: {
               required: [],
               elective: [],
               free: [],
               determined: [],
               addup: []
            },
            addupList: {
               number: null,
               units: [],
               description: null
            }
         };

         // console.log(dom);

         var unitIDHead = 0;
         LARGE_CATEGORY.forEach(function (lc) {
            SMALL_CATEGORY.forEach(function (sc, index) {

               let category = dom.querySelector('requirement > ' + lc + '>' + sc);
               let addup = false;

               unitTree[lc]['determined'][index] = category.hasAttribute('determined');
               unitTree[lc]['addup'][index] = category.hasAttribute('addup');

               if (category.hasAttribute('addup') && !unitTree.addupList.number) {
                  unitTree.addupList.number = parseFloat(category.querySelector('number').innerHTML);
                  unitTree.addupList.description = category.getAttribute('addup');
               }

               if (category.hasAttribute('addup')) {
                  addup = true;
               }

               dom.querySelectorAll('requirement > ' + lc + ' > ' + sc + ' > unit').forEach(function (unit) {

                  var unitJSON;
                  if (unit.getElementsByTagName('range').length == 0) {
                     unitJSON = {
                        id: unitIDHead++,
                        name: unit.querySelector('name').innerHTML,
                        match: unit.querySelector('match').innerHTML,
                        number: {
                           hasRange: false,
                           number: unit.querySelector('number').innerHTML,
                        },
                        allocatedCredit: []
                     };
                  } else {
                     let numMin = unit.getElementsByTagName('minimum')[0].innerHTML;
                     let numMax = unit.getElementsByTagName('maximum')[0].innerHTML;
                     unitJSON = {
                        id: unitIDHead++,
                        name: unit.querySelector('name').innerHTML,
                        match: unit.querySelector('match').innerHTML,
                        number: {
                           hasRange: true,
                           minimum: numMin,
                           maximum: numMax
                        },
                        allocatedCredit: []
                     };
                  }
                  groupingList.push(unitJSON);
                  unitTree[lc][sc].push(unitJSON);

                  if (addup) {
                     unitTree.addupList.units.push(unitJSON);
                  }

               }, this);
            }, this);
         });
         // console.log(groupingList);
         // console.log(this.state.tree);
         /*
          parentThis.setState({
          tree: unitTree
          });
          */
         console.log(unitTree);
         resolve([unitTree, groupingList]);
      });
   }

   calAddupList() {
      let addupList = this.state.tree.addupList;
      let length = addupList.units.length;
      let sum = 0;
      for (let i = 0; i < length; i++) {
         let cre_length = addupList['units'][i]['allocatedCredit'].length;
         for (let j = 0; j < cre_length; j++) {
            sum += parseFloat(addupList['units'][i]['allocatedCredit'][j].number);
         }
      }
      return [sum, addupList.number, addupList.description];
   }

   isInAddupList(id) {
      let addupList = this.state.tree.addupList;
      let length = addupList.units.length;
      for (let i = 0; i < length; i++) {
         if (addupList['units'][i].id == id) {
            return true;
         }
      }
      return false;
   }

   verify(grade_global, unitTree_global, unitList_global) {
      let parentThis = this;
      let unitList = unitList_global;

      // console.log(parentThis);

      /**
       * 割り当て可能な単位と区分の組み合わせを記録します。
       */
      var allocationGroups_global = [];

      return new Promise((resolve) => {

         /**
          * ユーザーの履修状況を管理するオブジェクト
          * @type {object.<string, object>}
          */
         var grade = grade_global;

         /**
          * 卒業要件の各区分を{専門科目, 専門基礎科目, 基礎共通科目, 基礎関連科目}, {必修科目, 選択科目, 自由科目}の階層構造で記録
          * @type {object.<string, object>}
          */
         var unitTree = unitTree_global;

         /**
          * 卒業要件の区分を配列で記録
          * @type {array.<object>}
          */
         var unitList = unitList_global;

         // console.info(unitList);
         // console.log(grade);
         // console.log(unitTree);
         let units = unitTree;
         // var allocationCombination = []

         /**
          * 卒業要件の各区分に割り当てられている単位を記録する連装配列
          * @type {object.<string, array.<number>>}
          */
         var allocation_unit = {};

         /**
          * 各単位の割り当て先の卒業要件の区分を記録する連装配列
          * @type {object.<string, number>}
          */
         var allocation_credit = {};

         /*
          * 専門科目の必修科目は1つの科目区分に1つの単位が定まるので先に確定
          */
         units.MS.required.forEach(function (unit) {
            let rexp = new RegExp(unit.match);
            grade.creditList.forEach(function (credit, index) {
               // console.log(allocation[index]);
               // console.log(credit.total);
               if (Boolean(allocation_credit[index]) != true &&
                  rexp.test(credit.code) && !this.unitIsFilled(unit, allocation_unit[unit.id]) &&
                  credit.total != 'D') {
                  // console.log(unit);
                  // unit.allocatedCredit.push(credit);
                  // allocation[credit.id] = true;
                  // console.info(allocation_unit[unit.id], Boolean(allocation_unit[unit.id]));
                  if (allocation_unit[unit.id]) {
                     allocation_unit[unit.id].push(credit.id);
                     allocation_credit[credit.id] = unit.id;
                  } else {
                     allocation_unit[unit.id] = [credit.id];
                     allocation_credit[credit.id] = unit.id;
                  }
               }
            }, parentThis);
         }, parentThis);

         /*
          * 専門基礎科目の必修科目は1つの科目区分と1つの単位が定まるので先に確定
          */
         units.FSM.required.forEach(function (unit) {
            let rexp = new RegExp(unit.match);
            grade.creditList.forEach(function (credit, index) {
               // console.log(allocation[index]);
               // console.log(credit.total);
               if (Boolean(allocation_credit[index]) != true &&
                  rexp.test(credit.code) && !this.unitIsFilled(unit, allocation_unit[unit.id]) &&
                  credit.total != 'D') {
                  // console.info(allocation_unit[unit.id], Boolean(allocation_unit[unit.id]));
                  if (allocation_unit[unit.id]) {
                     allocation_unit[unit.id].push(credit.id);
                     allocation_credit[credit.id] = unit.id;
                  } else {
                     allocation_unit[unit.id] = [credit.id];
                     allocation_credit[credit.id] = unit.id;
                  }
               }
            }, parentThis);
         }, parentThis);

         /*
          * 基礎共通科目の必修科目は1つの科目区分と1つの単位が定まるので先に確定
          */
         units.GFS_common.required.forEach(function (unit) {
            let rexp = new RegExp(unit.match);
            grade.creditList.forEach(function (credit, index) {
               // console.log(allocation[index]);
               // console.log(credit.total);
               if (Boolean(allocation_credit[index]) != true &&
                  rexp.test(credit.code) && !this.unitIsFilled(unit, allocation_unit[unit.id]) &&
                  credit.total != 'D') {
                  // console.info(allocation_unit[unit.id], Boolean(allocation_unit[unit.id]));
                  if (allocation_unit[unit.id]) {
                     allocation_unit[unit.id].push(credit.id);
                     allocation_credit[credit.id] = unit.id;
                  } else {
                     allocation_unit[unit.id] = [credit.id];
                     allocation_credit[credit.id] = unit.id;
                  }
               }
            }, parentThis);
         }, parentThis);

         // console.info(allocation_unit);
         // console.info(allocation_credit);


         /*
          * 割り当てが定まらなかった単位を抽出
          */
         var unallocatedList = [];
         // console.info(allocation);
         // console.info(grade.creditList);
         grade.creditList.forEach((credit, index) => {
            if (!allocation_credit[index]) {
               unallocatedList.push(credit);
            }
         });

         /*
          * 科目区分とその区分に割り当て可能な単位の組み合わせを求める
          */
         // console.info(unitList);
         unallocatedList.forEach((credit) => {
            var allocatableUnits = [];
            unitList.forEach((unit) => {
               let rexp = new RegExp(unit.match);
               if (rexp.test(credit.code) && !this.unitIsFilled(unit) &&
                  credit.total != 'D') {
                  allocatableUnits.push(unit);
               }
            }, parentThis);
            var newAllocation = true;
            allocationGroups_global.forEach((allocation) => {
               if (JSON.stringify(allocation.units) === JSON.stringify(allocatableUnits)) {
                  allocation.credits.push(credit);
                  newAllocation = false;
               }
            });
            if (newAllocation && allocatableUnits.length != 0) {
               allocationGroups_global.push({
                  units: allocatableUnits,
                  credits: [].concat(credit)
               });
            }
         }, parentThis);

         // console.info('allocationGroups:\n' + JSON.stringify(allocationGroups_global, null, '\t'));

         /**
          * 上で求めた各組み合わせについて、単位の割り当て方を全パターン求める。
          */
         //getAllocationPatternNew();

         /*
          各ユニットに割り当てる単位の単位数を記録する多次元配列。
          1次元目のインデックスはグループ番号、各要素には2次元が格納されており、
          その0個目の配列は対象のユニットidを並べた配列、1個目以降に各パターンにおけるユニット毎の単位数を並べた配列を含む2次元配列が格納されている
          */
         var creditSumPattern = new Array();
         /*
          各ユニットに割り当てる単位のidを記録する多次元次元配列。
          1次元目のインデックスはグループ番号、各要素には2次元が格納されており、
          その0個目の配列は対象のユニットidを並べた配列、1個目以降に各パターンにおけるユニット毎の割り当て単位を並べた配列の配列が格納されている
          */
         var creditAllocationPattern = new Array();

         // グループでループ
         for (let i = 0; i < allocationGroups_global.length; i++) {

            let targetGroup = allocationGroups_global[i];
            // console.info('targetGroup:\n' + JSON.stringify(targetGroup, null, '\t'));

            // 配列0行目の要素はユニットidを並べた配列
            if (!creditSumPattern[i]) {
               var idList = [];
               for (let j = 0; j < targetGroup.units.length; j++) {
                  idList.push(targetGroup.units[j].id);
               }
               creditSumPattern[i] = [];
               creditSumPattern[i][0] = idList;
               creditAllocationPattern[i] = [];
               creditAllocationPattern[i][0] = idList;
            }

            // console.info(targetGroup.credits.length);

            var paddinger = new Array(targetGroup.credits.length + 1).join('0');
            // console.info(paddinger);

            var _bestOverflowNum = Number.MAX_VALUE;

            // グループ内の割り当てパターンでループ
            loop:
               for (let j = 0; j < Math.pow(targetGroup.units.length, targetGroup.credits.length); j++) {

                  // console.info('%cpattern ' + j + ' of ' + Math.pow(targetGroup.units.length, targetGroup.credits.length), 'font-weight: bold');
                  // console.info(targetGroup);

                  // 科目分類数の進数表現を利用して各単位を割り当てる科目分類を表現
                  var combination;
                  if (targetGroup.units.length > 1) {
                     combination = (paddinger + j.toString(targetGroup.units.length)).slice(-1 * targetGroup.credits.length);
                  } else {
                     combination = paddinger;
                  }

                  /*
                   * 各ユニットごとに割り当てる単位および単位数を算出
                   */
                  var allocation = new Array(targetGroup.units.length);
                  var creditSum = new Array(targetGroup.units.length);
                  // 初期化
                  for (let k = 0; k < creditSum.length; k++) {
                     creditSum[k] = 0;
                     allocation[k] = [];
                  }
                  // 割り当てる単位・単位数を算出
                  for (let k = 0; k < combination.length; k++) {
                     let unitNum = parseInt(combination.charAt(k), 10);
                     // console.info(unitNum);
                     creditSum[unitNum] += parseFloat(targetGroup.credits[k].number);
                     allocation[unitNum].push(targetGroup.credits[k].id);
                  }
                  // 算出した単位数の組み合わせが既存の組み合わせと被る場合は結果に追加せずスキップ
                  for (let k = 1; k < creditSumPattern[i].length; k++) {
                     if (creditSumPattern[i][k].toString() == creditSum.toString()) {
                        continue loop;
                     }
                  }
                  // パターン数削減のため、ユニットの必要単位数を超過している単位数が一番少ないパターン以外は除外
                  let _overflowCount = 0;
                  for (let k = 0; k < creditSum.length; k++) {
                     let _maximumNum = (targetGroup.units[k].number.hasRange) ? (targetGroup.units[k].number.maximum) : (targetGroup.units[k].number.number);
                     _overflowCount = (Math.max(_overflowCount, (creditSum[k] - _maximumNum)));
                  }
                  if (_overflowCount < _bestOverflowNum) {
                     creditSumPattern[i] = [];
                     creditSumPattern[i][0] = idList;
                     creditAllocationPattern[i] = [];
                     creditAllocationPattern[i][0] = idList;
                     _bestOverflowNum = _overflowCount;
                  } else if (_overflowCount > _bestOverflowNum) {
                     continue loop;
                  }

                  // 結果に追加
                  creditSumPattern[i].push(creditSum);
                  creditAllocationPattern[i].push(allocation);
               }
         }

         /*
          * 上で求めた各組み合わせにおける単位の割り当てパターンを使用して、最も全体で単位を無駄にしない割り当て方を求める
          */

         getWholeAllocation([], creditSumPattern, creditAllocationPattern);


         // console.info(getWholeAllocation.bestPattern);
         // console.info(getWholeAllocation.overflowCredits);

         var resultPattern = getWholeAllocation.bestPattern[0];
         // console.info(resultPattern);

         // console.info(creditAllocationPattern);

         for (let i = 0; i < resultPattern.length; i++) {
            var patternNum = resultPattern[i];
            // console.info(creditAllocationPattern[i][0]);
            var unitIdList = creditAllocationPattern[i][0];
            for (let j = 0; j < unitIdList.length; j++) {
               // console.info(creditAllocationPattern[i][patternNum][j]);
               // console.info(user_grade_global.creditList[creditAllocationPattern[i][patternNum][j]]);
               for (let k = 0; k < creditAllocationPattern[i][patternNum][j].length; k++) {
                  unitList[unitIdList[j]].allocatedCredit.push(user_grade_global.creditList[creditAllocationPattern[i][patternNum][j][k]]);
               }
            }
         }

         // console.info(user_grade_global.creditList);

         for (let unitId in allocation_unit) {
            for (let j = 0; j < allocation_unit[unitId].length; j++) {
               unitList[unitId].allocatedCredit.push(user_grade_global.creditList[allocation_unit[unitId][j]]);
            }
         }

         // console.info(units);
         // console.info(unitList);

         this.setState({
            tree: units
         });

         // console.log('done');
         resolve();
      });

      function getWholeAllocation(premisePatterns, creditSumPattern) {
         // console.group();
         // console.info('getAllocationPattern() is called. premisePatterns:\n' + JSON.stringify(premisePatterns, null, '\t'));

         if (typeof getWholeAllocation.patternLink === 'undefined') {
            getWholeAllocation.patternLink = {};
         }
         if (typeof getWholeAllocation.bestPattern === 'undefined') {
            getWholeAllocation.bestPattern = [];
         }
         if (typeof getWholeAllocation.overflowCredits === 'undefined') {
            getWholeAllocation.overflowCredits = new Array(10);
            for (let i = 0; i < 10; i++) {
               getWholeAllocation.overflowCredits[i] = 999;
            }
         }

         let groupIndex = premisePatterns.length;

         // console.info('groupindex:\n' + JSON.stringify(groupIndex));

         // 1つ前のグループまでで確定したユニットと単位の組み合わせを抽出
         var premiseAllocation = {};
         for (let i = 0; i < premisePatterns.length; i++) {
            for (let j = 0; j < creditSumPattern[i][premisePatterns[i]].length; j++) {
               if (!premiseAllocation[creditSumPattern[i][0][j]]) {
                  premiseAllocation[creditSumPattern[i][0][j]] = parseFloat(creditSumPattern[i][premisePatterns[i]][j]);
               } else {
                  premiseAllocation[creditSumPattern[i][0][j]] += parseFloat(creditSumPattern[i][premisePatterns[i]][j]);
               }
            }
         }

         // 再帰の末尾まで達した場合
         if (allocationGroups_global.length == groupIndex) {
            // console.info('maximum depth reached.');
            // getWholeAllocation.bestPattern.push(premisePatterns);
            // console.groupEnd();

            var _overflowCount = 0;
            for (let key in premiseAllocation) {
               var _maximumNum = (unitList[key].number.hasRange) ? (unitList[key].number.maximum) : (unitList[key].number.number);
               _overflowCount += (Math.max(0, (premiseAllocation[key] - _maximumNum)));
            }

            var maxItemCount = Math.max.apply(null, getWholeAllocation.overflowCredits);

            // console.info(_overflowCount);

            if (_overflowCount <= maxItemCount) {
               var insertIndex = getWholeAllocation.overflowCredits.indexOf(maxItemCount);
               getWholeAllocation.bestPattern[insertIndex] = premisePatterns;
               getWholeAllocation.overflowCredits[insertIndex] = _overflowCount;
            }

            // console.info(getWholeAllocation.bestPattern);

            return;
         }

         // console.info(pattern);

         // 現グループの各パターンでループ
         loop:
            for (let i = 1; i < creditSumPattern[groupIndex].length; i++) {

               var currentAllocation = parentThis.clone(premiseAllocation);

               for (let j = 0; j < creditSumPattern[groupIndex][i].length; j++) {
                  if (!currentAllocation[creditSumPattern[groupIndex][0][j]]) {
                     currentAllocation[creditSumPattern[groupIndex][0][j]] = parseFloat(creditSumPattern[groupIndex][i][j]);
                  } else {
                     currentAllocation[creditSumPattern[groupIndex][0][j]] += parseFloat(creditSumPattern[groupIndex][i][j]);
                  }
               }

               // console.info(currentAllocation);

               var overflowCount = 0;
               for (let key in currentAllocation) {
                  var maximumNum = (unitList[key].number.hasRange) ? (unitList[key].number.maximum) : (unitList[key].number.number);
                  overflowCount += (Math.max(0, (currentAllocation[key] - maximumNum)));
               }

               // console.info(overflowCount);

               if (overflowCount >= Math.max.apply(null, getWholeAllocation.overflowCredits)) {
                  continue loop;
               }

               var nextPattern = [].concat(premisePatterns);
               nextPattern.push(i);

               getWholeAllocation(nextPattern, creditSumPattern);

            }
      }
   }

   combinationIsValid(combination, targetGroup) {
      // 要素数を指定してすべて0で初期化
      var creditSum = new Array(targetGroup.units.length);
      for (let i = 0; i < creditSum.length; i++)
         creditSum[i] = 0;

      // ユニット毎に割り当てた単位数を算出
      for (let i = 0; i < combination; i++) {
         let unitNum = parseInt(combination.charAt(i), 10);
         creditSum[unitNum] += parseFloat(targetGroup.credits[i].number);
      }

   }

   getCreditsFromId(idList) {
      if (idList) {
         var result = [];
         for (let i = 0; i < idList.length; i++) {
            result.push(user_grade_global.creditList[idList[i]]);
         }
         return result;
      } else {
         return [];
      }
   }

   getCreditFromId(id) {
      return user_grade_global.creditList[id];
   }

   unitIsFilled(unit, credits) {
      // console.info(unit, credits);
      var sum = 0;
      if (credits) {
         credits.forEach((credit) => {
            sum += parseFloat(credit.number);
         });
         return (sum >= unit.number.number);
      } else {
         return false;
      }
   }

   clone(src) {
      var dst = {};
      for (var k in src) {
         dst[k] = src[k];
      }
      return dst;
   }


}

class Grade {

   constructor(file) {
      // console.log(file);
      this.file = file;
      this.readGradeFile = this.readGradeFile.bind(this);
      this.parseCreditFile = this.parseCreditFile.bind(this);
      this.creditList = [];
      // this.readGradeFile(file);
   }

   readGradeFile() {
      let parentThis = this;
      let file = this.file;
      return new Promise(function (resolve) {
         let reader = new FileReader();
         reader.onload = function () {
            // console.log(reader.result);
            parentThis.parseCreditFile(reader.result).then(function (credits) {
               parentThis.creditList = credits;
               resolve();
            });
         };
         reader.readAsText(file);
      });
   }

   parseCreditFile(fileText) {
      return new Promise(function (resolve) {
         var creditArray = [];
         var rowArray = fileText.split('\n');
         var index = 0;
         // rowArray.shift();
         // console.log(rowArray);
         var codeColumnIndex = null;
         var titleColumnIndex = null;
         var numberColumnIndex = null;
         var totalColumnIndex = null;
         rowArray.forEach(function (currentValue, index) {
            var eleArray = currentValue.split('\",\"');
            if (index == 0) {
               // console.log(eleArray);
               for (var i = 0; i < eleArray.length; i++) {
                  if (eleArray[i] == '科目番号') {
                     codeColumnIndex = i;
                  } else if (eleArray[i] == '科目名 ') {
                     titleColumnIndex = i;
                  } else if (eleArray[i] == '単位数') {
                     numberColumnIndex = i;
                  } else if (eleArray[i] == '総合評価') {
                     totalColumnIndex = i;
                  }
               }
            } else {
               if (currentValue != '') {
                  let newCredit = new Credit(
                     (index - 1),
                     eleArray[codeColumnIndex],
                     eleArray[titleColumnIndex],
                     eleArray[numberColumnIndex],
                     eleArray[totalColumnIndex]);
                  creditArray.push(newCredit);
               }
            }
         });
         // console.log(creditArray);
         resolve(creditArray);
      });
   }
}

class Credit {

   constructor(id, code, title, number, total) {
      this.id = id;
      this.code = code;
      this.title = title;
      this.number = number;
      this.total = total;
   }

}
