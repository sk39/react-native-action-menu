# react-native-action-menu

Action menu for React Native.

[![NPM](https://img.shields.io/npm/v/@sk39/react-native-action-menu.svg)](https://www.npmjs.com/package/@sk39/react-native-action-menu)

<img width="234" alt="menu" src="https://user-images.githubusercontent.com/28267362/97999905-3ec00580-1e2f-11eb-9fec-006266222a7c.png">

## Dependencies
* [react-native-elements](https://github.com/react-native-elements/react-native-elements).
* [react-native-portalize](https://github.com/jeremybarbet/react-native-portalize).

## Install

```bash
npm install @sk39/react-native-action-menu
```

## Usage

### Props

| Props        | Default     | Description  |
| ------------- |:-------------:| -----:|
| duration      | 400 |  |
| centralCircleSize     | 130      |  |
| circleSpaceSize     |  56    |  |


```jsx
import React, {Component} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {ActionMenu} from "react-native-action-menu";

class Example extends Component {
  menuRef = React.createRef<ActionMenu>();

  onSelect(ev, item) {
    const actions = [
        {
            title: "Show Detail",
            method: ()=>console.log("Show Detail"),
            icon: {name: "eye", type: "feather"},
            color: Colors.primary
        },
        {
            title: "Invest",
            method: ()=>console.log("Show Detail"),
            icon: {name: "shopping-cart", type: "feather"},
            color: Colors.second
        }
    ];

    this.menuRef.current.show({
        title: item.name,
        actions,
        py: ev.nativeEvent.pageY
    })
  }

  render () {
    return (
       <View>
          <TouchableOpacity onPress={ev => this.onSelect(ev, item)}>...</TouchableOpacity>
          <ActionMenu ref={this.menuRef}/>
       </View>
    )
  }
}
```

## License

MIT © [sk39](https://github.com/sk39)
