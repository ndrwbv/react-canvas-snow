export interface SnowConfig {
  /** Snowflake size in pixels (min-max range) */
  size: {
    min: number;
    max: number;
  };
  /** Fall speed — time in seconds for a snowflake to traverse the full height (min-max range) */
  speed: {
    min: number;
    max: number;
  };
  /** Total number of snowflakes */
  count: number;
  /** Snowflake opacity range (0–1) */
  opacity?: {
    min: number;
    max: number;
  };
  /** Horizontal swing amplitude in pixels (min-max range) */
  swing?: {
    min: number;
    max: number;
  };
  /** Snowflake color (any valid CSS color). Defaults to `"white"` */
  color?: string;
}

export interface SnowProps {
  /** Partial config to override defaults */
  config?: Partial<SnowConfig>;
  /** Additional CSS class name for the container */
  className?: string;
  /** Inline styles for the container */
  style?: React.CSSProperties;
}
