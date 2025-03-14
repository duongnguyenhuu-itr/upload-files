import { Button, ButtonProps, Tooltip } from 'antd';
import { TooltipPlacement } from 'antd/es/tooltip';
import classnames from 'classnames';
import style from './style.module.scss';
import './style.scss';
import { IBaseProps } from '@/model/baseProps';

interface IProps extends ButtonProps, IBaseProps {
  /** The text shown in the tooltip */
  tooltipTitle?: string;
  /** The position of the tooltip relative to the target. Default is 'top' */
  tooltipPlacement?: TooltipPlacement;
  /** The alignment of the tooltip */
  tooltipAlign?: {
    offset?: [number, number];
    points?: [string, string];
    overflow?: { adjustX: number; adjustY: number };
    targetOffset?: any[];
  };
  isReverse?: boolean;
  /** Default type and primary border, color */
  isPrimaryOutlineType?: boolean;
}

// use export support Storybook map props
export const CustomButton = (props: IProps): JSX.Element => {
  const {
    className,
    tooltipTitle,
    tooltipPlacement,
    tooltipAlign,
    isPrimaryOutlineType,
    isReverse,
    children,
    ...restProps
  } = props;

  return (
    <Tooltip
      title={tooltipTitle}
      placement={tooltipPlacement}
      align={tooltipAlign}
      getPopupContainer={(triggerNode) => triggerNode.parentElement}
    >
      <Button
        className={classnames(
          style.customButton,
          isPrimaryOutlineType ? style.primaryOutlineType : undefined,
          isReverse ? 'reverse-button' : undefined,
          props.type === 'link' ? style.linkType : undefined,
          props.loading ? style.loading : undefined,
          className,
        )}
        {...restProps}
      >
        {children}
      </Button>
    </Tooltip>
  );
};

CustomButton.defaultProps = {
  tooltipTitle: '',
};

export default CustomButton;
