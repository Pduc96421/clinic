import { useForm } from 'react-hook-form';
import classNames from 'classnames/bind';
import styles from './Register.module.scss';
import { Link } from 'react-router-dom';

const cx = classNames.bind(styles);

type FormData = {
  username: string;
  password: string;
  confirmPassword: string;
  email: string;
  sex: string;
  fullName: string;
  bd: string;
};

function Register() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = (data: FormData) => {
    console.log(data);
  };
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className={cx('form-register')}>
        <h2>Đăng kí</h2>

        <label htmlFor="username">Tên đăng nhập:</label>
        <input
          type="text"
          id="username"
          {...register('username', {
            required: 'Hãy nhập tên đăng nhập',
            minLength: {
              value: 4,
              message: 'Tên đăng nhập phải có ít nhất 4 kí tự',
            },
          })}
        />
        {errors.username && <p className={cx('error')}>{errors.username.message}</p>}

        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          {...register('email', {
            required: 'Hãy nhập email',
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
              message: 'Email không hợp lệ',
            },
          })}
        />
        {errors.email && <p className={cx('error')}>{errors.email.message}</p>}

        <label htmlFor="bd">Ngày sinh</label>
        <input
          type="date"
          id="bd"
          {...register('bd', {
            required: 'Hãy nhập ngày sinh',
          })}
        />
        {errors.bd && <p className={cx('error')}>{errors.bd.message}</p>}

        <label htmlFor="fullName">Họ và tên:</label>
        <input
          type="text"
          id="fullName"
          {...register('fullName', {
            required: 'Hãy nhập họ và tên',
          })}
        />
        {errors.fullName && <p className={cx('error')}>{errors.fullName.message}</p>}

        <label>Giới tính:</label>
        <div className={cx('radio-group')}>
          <label>
            <input type="radio" value="Nam" {...register('sex', { required: 'Hãy chọn giới tính' })} /> Nam
          </label>
          <label style={{ marginLeft: 12 }}>
            <input type="radio" value="Nữ" {...register('sex', { required: 'Hãy chọn giới tính' })} /> Nữ
          </label>
          <label style={{ marginLeft: 12 }}>
            <input type="radio" value="Khác" {...register('sex', { required: 'Hãy chọn giới tính' })} /> Khác
          </label>
        </div>
        {errors.sex && <p className={cx('error')}>{errors.sex.message}</p>}

        <label htmlFor="password">Mật khẩu:</label>
        <input
          type="password"
          id="password"
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

        <label htmlFor="confirmPassword">Xác nhận mật khẩu:</label>
        <input
          type="password"
          id="confirmPassword"
          {...register('confirmPassword', {
            required: 'Hãy xác nhận mật khẩu',
            validate: (value) => {
              if (value !== watch('password')) {
                return 'Mật khẩu xác nhận không khớp';
              }
            },
          })}
        />
        {errors.confirmPassword && <p className={cx('error')}>{errors.confirmPassword.message}</p>}

        <button type="submit" className={cx('btn-submit')}>
          Đăng kí
        </button>

        <Link to={'/auth/login'} className={cx('btn-login')}>
          Bạn đã có tài khoản?
        </Link>
      </form>
    </>
  );
}

export default Register;
