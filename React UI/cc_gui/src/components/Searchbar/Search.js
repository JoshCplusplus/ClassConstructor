import React from "react";
import { render } from "react-dom";
import _ from "lodash/fp";
import Fuse from "fuse.js";

class Search extends React.Component {
  state = {
    searchVal: "",
    data: data
  };
  someCounter = 100;

  fuse(e, y) {
    const nested = y === 2 ?
     [{ name: "typechild.name", weight: 0.4 }, { name: "typechild.vals", weight: 0.3 }] :
     [{ name: "name", weight: 0.4 }, { name: "vals", weight: 0.2 }];
    const threshhold = y === 2 ? 0.3 : 0.3;
    // 2 means it is nested
    var opts = {
      shouldSort: true,
      threshold: threshhold,
      keys: nested
    };
    var fuse = new Fuse(e, opts);
    var res = fuse.search(this.state.searchVal);
    return res;
  }

  nestedUniq(e) {
    const res = _.flow(_.flatMap("typechild"), _.values(), _.uniqBy("name"))(e);
    // THIS will cause an issue IF have two sub-tags with the same name (differing vals). Is this a super rare case? Orange and Orange?
    // COULD do uniqueBy vals instead?
    // const err = _.flow(_.flatMap("typechild"), _.values(), _.uniqBy("name"))(e)
    // res.forEach(el => { el.clickOrder = this.someCounter++})
    // console.log("err", res);
    return res;
  }
  render() {
    const { searchVal, data } = this.state;
    const searchOn = searchVal.length > 0;

    let output1;
    let output2;

    if (searchOn && this.fuse(data).length > 0) {
      output1 = this.fuse(data);
      output2 = this.fuse(data).filter(e => this.fuse(data)).map(r => r.typechild)[0];
    } else if (searchOn && this.fuse(data, 2).length > 0) {
      output1 = this.fuse(data, 2);
      output2 = this.fuse(this.nestedUniq(data, 2));
    } else if (searchOn && this.fuse(data, 2).length === 0 && this.fuse(data).length === 0) {
      output1 = [{ name: "No Res" }];
      output2 = [{ name: "No Res" }];
    }
    else {
      // data.forEach(el => { el.clickOrder = this.someCounter++*30 })
      output1 = data;
      output2 = this.nestedUniq(data);
    }

    return (
      <div>
        <input onChange={e => this.setState({ searchVal: e.target.value })} />
        <br />
        {output1.map(x => {
          return <span key={x.name}>{x.name} </span>;
        })}
        <br /> <h2>T2</h2>
        {output2.map((x, idx) => {
          return <span key={idx}>{x.name} </span>;
        })}
      </div>
    );
  }
}

// User R.assoc and R.over to get nested data
const data = [
  {
    name: "Fruit",
    vals: "magic",
    typechild: [
      {
        color: "#fff",
        level: 2,
        name: "Orange",
        vals: "diet"
      },
      {
        color: "#fff",
        level: 3,
        name: "Apple",
        vals: "health"
      }
    ]
  },
  {
    name: "Vegetable",
    typechild: [
      {
        color: "#fff",
        level: 2,
        name: "Potato",
        vals: "recipe"
      }
    ]
  },
  {
    name: "Technology",
    typechild: [
      {
        color: "#fff",
        level: 2,
        name: "App",
        vals: ["ipod", "iphone", "apple"]
      }
    ]
  },
  {
    name: "Color",
    typechild: [
      {
        color: "#fff",
        level: 2,
        name: "Green",
        vals: ["paiting", "nature", "rain"]
      }
    ]
  }
];

export default Search
