import React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";

type IconProps = SvgProps & {
  width?: number | string;
  height?: number | string;
  fill?: string;
};

const Heart: React.FC<IconProps> = ({
  width = 26,
  height = 24,
  fill = "black",
  ...props
}) => (
  <Svg width={width} height={height} viewBox="0 0 26 24" {...props}>
    <Path
      d="M6.81355 0.00364464C8.71639 0.0458453 10.8292 1.03756 13.0036 3.2953C15.1741 1.04389 17.285 0.0542854 19.1859 0.0141948C21.1889 -0.0280058 22.8799 0.984812 24.0701 2.50403C26.4159 5.50028 26.9013 10.6277 23.9584 13.8497L23.9565 13.8518L15.7769 22.7308C14.2169 24.4231 11.7902 24.4231 10.2302 22.7308L2.05258 13.8518C-0.899906 10.615 -0.420343 5.48762 1.92547 2.48715C3.11379 0.967931 4.80477 -0.0448862 6.81162 0.00153451L6.81355 0.00364464Z"
      fill={fill}
      fillRule="evenodd"
      clipRule="evenodd"
    />
  </Svg>
);

export default React.memo(Heart);
