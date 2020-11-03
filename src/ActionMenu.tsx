import React, {Component} from "react";
import {Animated, Easing, StyleSheet, Text, View} from "react-native";
import {Portal} from "react-native-portalize";
import Layout from "./Layout";
import {Action} from "./model";
import ActionCircle from "./ActionCircle";

interface Props {
  duration: number;
  centralCircleSize: number;
  circleSpaceSize: number;
}

interface State {
  showStatus: "show" | "showing" | "hiding" | null
  phase: Animated.Value
}

interface ShowParam {
  title: string,
  actions: Action[],
  py?: number | null,
}

export default class ActionMenu extends Component<Props, State> {

  static defaultProps = {
    duration: 400,
    centralCircleSize: 130,
    circleSpaceSize: 56
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      showStatus: null,
      phase: new Animated.Value(0)
    }
  }

  param: ShowParam = {
    title: "",
    actions: [],
    py: null
  }

  show = (param: ShowParam) => {
    this.param = param;
    this.setState({showStatus: "showing"})
    Animated.timing(this.state.phase, {
      easing: Easing.inOut(Easing.ease),
      toValue: 1,
      duration: this.props.duration,
      delay: 0,
      useNativeDriver: true,
    }).start(() => this.setState({showStatus: "show"}));
  }

  hide = () => {
    this.setState({showStatus: "hiding"})
    Animated.timing(this.state.phase, {
      easing: Easing.inOut(Easing.ease),
      toValue: 0,
      duration: this.props.duration,
      delay: 0,
      useNativeDriver: true,
    }).start(() => this.setState({showStatus: null}))
  }

  onAction = (action: Action) => {
    this.hide();
    action.method();
  }

  renderRow(index: number) {
    const {centralCircleSize, circleSpaceSize} = this.props;
    const {showStatus} = this.state;
    const {actions, title} = this.param;
    const action = actions[index];
    const size = centralCircleSize + (circleSpaceSize * 2) * (index + 1);
    const show = showStatus && showStatus !== "hiding";
    const circleDelay = 100;//TODO:duration / actions.length;
    const delay = circleDelay * (actions.length - 1 - index);
    const hideDelay = circleDelay * index;
    if (index === 0) {
      const centralSize = {
        width: centralCircleSize,
        height: centralCircleSize,
        borderRadius: centralCircleSize / 2
      }
      return (
        <ActionCircle
          show={show}
          size={size}
          action={action}
          onAction={this.onAction}
          delay={delay}
          hideDelay={hideDelay}
          duration={this.props.duration}
          onCancel={this.hide}
        >
          <View style={[styles.centralCircle, centralSize]}>
            <Text style={styles.centralLabelText}>{title}</Text>
          </View>
        </ActionCircle>
      )
    } else {
      return (
        <ActionCircle
          show={show}
          size={size}
          action={action}
          delay={delay}
          hideDelay={hideDelay}
          duration={this.props.duration}
          onAction={this.onAction}
        >
          {this.renderRow(index - 1)}
        </ActionCircle>
      )
    }
  }

  renderModal() {
    if (!this.state.showStatus) {
      return null;
    }

    const {centralCircleSize, circleSpaceSize} = this.props;
    const ani = {
      modalBack: {
        opacity: this.state.phase.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 1],
        })
      },
    };

    const {actions, py} = this.param;
    const contentHeight = centralCircleSize + (circleSpaceSize * 2) * (actions.length);
    const limitPy = Layout.window.height - contentHeight;
    const menuPy = (py || Layout.window.height / 2) - contentHeight / 2;
    const posStyle = {
      menu: {
        top: Math.min(limitPy, menuPy)
      }
    }

    return (
      <View style={styles.modal}>
        <Animated.View style={[styles.modalBack, ani.modalBack]}/>
        <Animated.View>
          <View style={[styles.menu, posStyle.menu]}>
            {this.renderRow(actions.length - 1)}
          </View>
        </Animated.View>
      </View>
    )
  }

  render() {
    return (
      <Portal>
        {this.renderModal()}
      </Portal>
    )
  }
}

const styles = StyleSheet.create({
  modal: {
    width: Layout.window.width,
    height: Layout.window.height
  },
  modalBack: {
    backgroundColor: "rgba(11,10,25,0.86)",
    flex: 1,
    ...StyleSheet.absoluteFillObject
  },
  menu: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    width: "100%",
  },
  centralCircle: {
    padding: 8,
    paddingVertical: 24,
    backgroundColor: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  centralLabelText: {
    fontSize: 13,
    fontWeight: "700",
    textAlign: "center"
  }
});
