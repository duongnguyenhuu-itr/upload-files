import { ProgressStatus } from '@/components/customProgress/customProgress.d';
import { useSetState } from '@/utils/customHook';
import { Progress } from 'antd';
import { FC, useEffect } from 'react';

interface IProps {
  className?: string;
  step: number;
  timePerStep: number;
  maxPercentWaiting: number;
  status: ProgressStatus;
}

interface IState {
  percent: number;
  status: ProgressStatus;
}

const CustomProgress: FC<IProps> = (props) => {
  const [state, setState] = useSetState<IState>({
    percent: 0,
    status: 'normal',
  });

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (state.percent < props.maxPercentWaiting && props.status === 'active') {
      timeout = setTimeout(() => {
        setState({
          percent: state.percent + props.step,
          status: 'active',
        });
      }, props.timePerStep);
      return () => {
        clearTimeout(timeout);
      };
    }
    if (props.status === 'success') {
      setState({
        percent: 100,
        status: 'success',
      });
      return () => {
        clearTimeout(timeout);
      };
    }
    if (props.status === 'exception') {
      setState({
        status: 'exception',
      });
      return () => {
        clearTimeout(timeout);
      };
    }
  }, [
    state.percent,
    props.maxPercentWaiting,
    props.step,
    props.timePerStep,
    props.status,
  ]);

  return <Progress percent={state.percent} status={state.status} />;
};

export default CustomProgress;
