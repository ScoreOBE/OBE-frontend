import React, { FunctionComponent } from "react";
type Props = {
  IconComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  className?: string;
  outlined?: boolean;
  onClick?: () => void;
};
class Icon extends React.Component<Props, any> {
  static defaultProps = {
    title: "",
    outlined: false,
  };
  constructor(props: any) {
    super(props);
  }

  render() {
    const { IconComponent, className, outlined, onClick } = this.props;
    return (
      <div
        className={`${className} flex justify-center items-center h-full`}
        onClick={onClick}
      >
        <IconComponent className={outlined ? "outline" : ""} />
      </div>
    );
  }
}
export default Icon;
