const {
  VITE_AWS_DOMAIN: AWS_DOMAIN,
  VITE_AWS_USER_POOLS_WEB_CLIENT_ID: AWS_USER_POOLS_WEB_CLIENT_ID,
} = import.meta.env;

const awsConfigAlpha = {
  aws_project_region: 'ap-southeast-1',
  aws_mobile_analytics_app_id: '5912d37b32da4e478bb919d9c8034442',
  aws_mobile_analytics_app_region: 'ap-southeast-1',
  Analytics: {
    AWSPinpoint: {
      appId: '5912d37b32da4e478bb919d9c8034442',
      region: 'ap-southeast-1',
    },
  },
  aws_cognito_identity_pool_id: 'ap-southeast-1:7842c5ee-5afd-4f49-b7f8-af8609039825',
  aws_cognito_region: 'ap-southeast-1',
  aws_user_pools_id: 'ap-southeast-1_XzX8xtfQF',
  aws_user_pools_web_client_id: AWS_USER_POOLS_WEB_CLIENT_ID,
  oauth: {
    domain: AWS_DOMAIN,
    scope: ['aws.cognito.signin.user.admin', 'email', 'openid', 'phone', 'profile'],
    redirectSignIn:
      'ediag://,http://localhost:3000/,http://localhost:3000/login/,http://localhost:3001/,http://localhost:3001/login/,https://admin.octomed.vn/,https://admin.octomed.vn/login/,https://airp.octomed.vn/,https://airp.octomed.vn/login/,https://admin.alpha.octomed.vn/,https://admin.alpha.octomed.vn/login/,https://airp.alpha.octomed.vn/,https://airp.alpha.octomed.vn/login/,https://callcenter.alpha.octomed.vn/,https://callcenter.alpha.octomed.vn/login/,https://clinic.alpha.octomed.vn/,https://clinic.alpha.octomed.vn/login/,https://octodx.alpha.octomed.vn/,https://octodx.alpha.octomed.vn/login/,https://erp.alpha.octomed.vn/,https://erp.alpha.octomed.vn/login/,https://octomed.alpha.vn/,https://octomed.alpha.vn/login/,https://suite.alpha.octomed.vn/,https://suite.alpha.octomed.vn/login/,https://callcenter.octomed.vn/,https://callcenter.octomed.vn/login/,https://clinic.octomed.vn/,https://clinic.octomed.vn/login/,https://octodx.octomed.vn/,https://octodx.octomed.vn/login/,https://erp.octomed.vn/,https://erp.octomed.vn/login/,https://octomed.vn/,https://octomed.vn/login/,https://suite.octomed.vn/,https://suite.octomed.vn/login/,octo360://',
    redirectSignOut:
      'ediag://,http://localhost:3000/,http://localhost:3000/login/,http://localhost:3001/,http://localhost:3001/login/,https://admin.octomed.vn/,https://admin.octomed.vn/login/,https://airp.octomed.vn/,https://airp.octomed.vn/login/,https://admin.alpha.octomed.vn/,https://admin.alpha.octomed.vn/login/,https://airp.alpha.octomed.vn/,https://airp.alpha.octomed.vn/login/,https://callcenter.alpha.octomed.vn/,https://callcenter.alpha.octomed.vn/login/,https://clinic.alpha.octomed.vn/,https://clinic.alpha.octomed.vn/login/,https://octodx.alpha.octomed.vn/,https://octodx.alpha.octomed.vn/login/,https://erp.alpha.octomed.vn/,https://erp.alpha.octomed.vn/login/,https://octomed.alpha.vn/,https://octomed.alpha.vn/login/,https://suite.alpha.octomed.vn/,https://suite.alpha.octomed.vn/login/,https://callcenter.octomed.vn/,https://callcenter.octomed.vn/login/,https://clinic.octomed.vn/,https://clinic.octomed.vn/login/,https://octodx.octomed.vn/,https://octodx.octomed.vn/login/,https://erp.octomed.vn/,https://erp.octomed.vn/login/,https://octomed.vn/,https://octomed.vn/login/,https://suite.octomed.vn/,https://suite.octomed.vn/login/,octo360://',
    responseType: 'code',
  },
  federationTarget: 'COGNITO_USER_POOLS',
  aws_cognito_username_attributes: ['EMAIL'],
  aws_cognito_social_providers: [],
  aws_cognito_signup_attributes: [],
  aws_cognito_mfa_configuration: 'OFF',
  aws_cognito_mfa_types: [],
  aws_cognito_password_protection_settings: {
    passwordPolicyMinLength: 8,
    passwordPolicyCharacters: [],
  },
  aws_cognito_verification_mechanisms: ['EMAIL'],
  aws_user_files_s3_bucket: 'itr-ecg-user-files82047-alpha',
  aws_user_files_s3_bucket_region: 'ap-southeast-1',
};

const awsConfigProd = {
  aws_project_region: 'ap-southeast-1',
  aws_mobile_analytics_app_id: 'b2307f26e24240c6b989a3df9a5f4d71',
  aws_mobile_analytics_app_region: 'ap-southeast-1',
  Analytics: {
    AWSPinpoint: {
      appId: 'b2307f26e24240c6b989a3df9a5f4d71',
      region: 'ap-southeast-1',
    },
  },
  aws_cognito_identity_pool_id: 'ap-southeast-1:28178a70-33ac-49a3-a392-8400a23b093d',
  aws_cognito_region: 'ap-southeast-1',
  aws_user_pools_id: 'ap-southeast-1_SCzXeCXgr',
  aws_user_pools_web_client_id: AWS_USER_POOLS_WEB_CLIENT_ID,
  oauth: {
    domain: AWS_DOMAIN,
    scope: ['aws.cognito.signin.user.admin', 'email', 'openid', 'phone', 'profile'],
    redirectSignIn:
      'ediag://,http://localhost:3000/,http://localhost:3000/login/,http://localhost:3001/,http://localhost:3001/login/,https://admin.octomed.vn/,https://admin.octomed.vn/login/,https://airp.octomed.vn/,https://airp.octomed.vn/login/,https://callcenter.octomed.vn/,https://callcenter.octomed.vn/login/,https://clinic.octomed.vn/,https://clinic.octomed.vn/login/,https://octodx.octomed.vn/,https://octodx.octomed.vn/login/,https://erp.octomed.vn/,https://erp.octomed.vn/login/,https://octomed.vn/,https://octomed.vn/login/,https://suite.octomed.vn/,https://suite.octomed.vn/login/,octo360://',
    redirectSignOut:
      'ediag://,http://localhost:3000/,http://localhost:3000/login/,http://localhost:3001/,https://admin.octomed.vn/,https://admin.octomed.vn/login/,https://airp.octomed.vn/,https://airp.octomed.vn/login/,https://callcenter.octomed.vn/,https://callcenter.octomed.vn/login/,https://clinic.octomed.vn/,https://clinic.octomed.vn/login/,https://octodx.octomed.vn/,https://octodx.octomed.vn/login/,https://erp.octomed.vn/,https://erp.octomed.vn/login/,https://octomed.vn/,https://octomed.vn/login/,https://suite.octomed.vn/,https://suite.octomed.vn/login/,octo360://',
    responseType: 'code',
  },
  federationTarget: 'COGNITO_USER_POOLS',
  aws_cognito_username_attributes: ['EMAIL'],
  aws_cognito_social_providers: [],
  aws_cognito_signup_attributes: [],
  aws_cognito_mfa_configuration: 'OFF',
  aws_cognito_mfa_types: [],
  aws_cognito_password_protection_settings: {
    passwordPolicyMinLength: 8,
    passwordPolicyCharacters: [],
  },
  aws_cognito_verification_mechanisms: ['EMAIL'],
  aws_user_files_s3_bucket: 'itr-ecg-user-files143840-prod',
  aws_user_files_s3_bucket_region: 'ap-southeast-1',
};

export { awsConfigAlpha, awsConfigProd };
