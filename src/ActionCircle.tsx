import React, {Component} from "react";
import {Animated, Easing, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {Icon} from "react-native-elements";
import {Action} from "./model";
import Layout from "./Layout";

interface Props {
  show: boolean | null;
  size: number;
  action: Action;
  onAction: (action: Action) => void;
  onCancel?: () => void;
  delay: number;
  hideDelay: number;
  duration?: number;
  easing?: (value: number) => number;
}

interface State {
  phase: Animated.Value
}

export default class ActionCircle extends Component<Props, State> {

  static defaultProps = {
    duration: 240,
    // @ts-ignore
    easing: Easing.out(Easing.back()),
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      phase: new Animated.Value(0)
    }
  }

  componentDidMount() {
    if (this.props.show) {
      this.show()
    }
  }

  componentDidUpdate(prevProps: Readonly<Props>) {
    if (!prevProps.show && this.props.show) {
      this.show()
    } else if (prevProps.show && !this.props.show) {
      this.hide()
    }
  }

  show() {
    const {delay, duration, easing} = this.props;
    Animated.timing(this.state.phase, {
      easing,
      toValue: 1,
      duration,
      delay,
      useNativeDriver: true
    }).start()
  }

  hide() {
    const {hideDelay, duration, easing} = this.props;
    Animated.timing(this.state.phase, {
      easing,
      toValue: 0,
      duration: duration,
      delay: hideDelay,
      useNativeDriver: true
    }).start()
  }

  render() {
    const {size, action, onAction, onCancel} = this.props;
    const sizeStyle = {
      width: size,
      height: size,
      borderRadius: size / 2
    }

    const aniStyle = {
      opacity: this.state.phase.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
      }),
      transform: [{
        scale: this.state.phase.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 1],
        }),
      }]
    }

    return (
      <Animated.View style={[styles.rowWrapper, aniStyle]}>
        <View style={styles.rowBtnTop}>
          <TouchableOpacity style={[styles.btnWrapper]}
                            onPress={() => onAction(action)}>
            <Text style={styles.text}/>
            <View style={[styles.iconButton, {backgroundColor: action.color}]}>
              <Icon name={action.icon.name}
                    type={action.icon.type}
                    color="white"/>
            </View>
            <Text style={styles.text}>{action.title}</Text>
          </TouchableOpacity>

        </View>
        <View style={[styles.row, sizeStyle]}>
          {this.props.children}
        </View>
        {onCancel && (
          <View style={styles.rowBtnBottom}>
            <TouchableOpacity style={styles.btnWrapper} onPress={onCancel}>
              <Text style={styles.text}/>
              <View style={[styles.iconButton]}>
                <Icon name="x"
                      type="feather"
                      color="#222"/>
              </View>
              <Text style={styles.text}/>
            </TouchableOpacity>
          </View>
        )}
      </Animated.View>
    )
  }
}

const iconButtonSize = 40;
const back = "rgba(239,244,246,0.1)"
const styles = StyleSheet.create({
  row: {
    backgroundColor: back,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  rowWrapper: {
    padding: iconButtonSize / 2,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  rowBtnTop: {
    position: "absolute",
    top: 0,
    zIndex: 1000,
  },
  rowBtnBottom: {
    position: "absolute",
    bottom: 0,
    zIndex: 1000,
  },
  iconButton: {
    width: iconButtonSize,
    height: iconButtonSize,
    borderRadius: iconButtonSize / 2,
    backgroundColor: "white",
    padding: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  btnWrapper: {
    display: "flex",
    overflow: "hidden",
    flexWrap: "nowrap",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: Layout.window.width,
    // paddingVertical: 6,
  },
  text: {
    color: "white",
    width: (Layout.window.width - iconButtonSize - 24) / 2
  }
});
