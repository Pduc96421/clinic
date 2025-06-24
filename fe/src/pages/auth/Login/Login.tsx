import classNames from 'classnames/bind';
import styles from './Login.module.scss';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';

const cx = classNames.bind(styles);

type FormData = {
  username: string;
  password: string;
};

function Login() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = (data: FormData) => {
    console.log(data);
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className={cx('form-login')}>
        <h2>Đăng nhập</h2>

        <label htmlFor="username">Tên đăng nhập: </label>
        <input
          type="text"
          id="username"
          placeholder="Tên đăng nhập hoặc Email ..."
          {...register('username', {
            required: 'Hãy nhập tên đăng nhập',
            minLength: {
              value: 4,
              message: 'Tên đăng nhập phải có ít nhất 4 kí tự',
            },
          })}
        />
        {errors.username && <p className={cx('error')}>{errors.username.message}</p>}

        <label htmlFor="password">Mật khẩu: </label>
        <input
          type="password"
          id="password"
          placeholder="Mật khẩu ..."
          {...register('password', {
            required: 'Hãy nhập mật khẩu',
            minLength: {
              value: 6,
              message: 'Mật khẩu phải có ít nhất 6 kí tự',
            },
            pattern: {
              value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,}$/,
              message: 'Mật khẩu phải có ít nhất 1 chữ hoa, 1 chữ thường và 1 số',
            },
          })}
        />
        {errors.password && <p className={cx('error')}>{errors.password.message}</p>}

        <button type="submit" className={cx('btn-submit')}>
          Đăng nhập
        </button>

        <Link to={'/auth/forgot-password'} className={cx('btn-forgot-password')}>
          quên mật khẩu?
        </Link>

        <div className={cx('divide-line')}></div>

        <button onClick={() => {navigate('/auth/register')}} type="button" className={cx('btn-register')}>
          Tạo tài khoản mới
        </button>
      </form>
    </>
  );
}

export default Login;
