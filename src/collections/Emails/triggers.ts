export const ACTION_TRIGGERS_WITH_VARIABLES = [
  // IAM
  {
    label: 'Invite user by email',
    value: 'iam:invite_user_by_email',
    variables: [
      { label: "From's First Name", value: 'from.first_name' },
      { label: "From's Name", value: 'from.name' },
      { label: "From's Email", value: 'from.email_address' },
      { label: "Recipient's Email", value: 'recipient.email_address' },
      { label: 'Password Reset Token', value: 'password_reset_token' },
    ]
  },
  {
    label: 'New user confirmed',
    value: 'iam:new_user_confirmed',
    variables: [
      { label: 'New User First Name', value: 'new_user.first_name' },
      { label: 'New User Name', value: 'new_user.name' },
      { label: 'New User Email', value: 'new_user.email_address' },
      { label: 'New User Role', value: 'new_user.role' },
    ]
  },

  // User
  {
    label: 'With Successful Purchase Complete',
    value: "user:with_successful_purchase_complete",
    variables: [
      { label: "Customer's Name", value: 'customer.name' },
      { label: "Customer's Email Address", value: 'customer.email_address' },
      { label: "Order number", value: 'order.number'},
      { label: 'Order Amount', value: 'order.amount' },
      { label: 'Order contents', value: 'order.contents' },
      { label: "Order total due", value: "order.total_due" },
      { label: "Order subtotal", value: "order.subtotal" },
      { label: "Order tax due", value: "order.tax_due" }
    ]
  },
  {
    label: "With subscription to newsletter",
    value: "user:with_subscribe_to_newsletter",
    variables: [
      { label: "Customer's Name", value: 'customer.name' },
      { label: "Customer's Email Address", value: 'customer.email_address' },
    ]
  },

  // Editor
  {
    label: "New announcement made",
    value: "editor:new_announcement_made",
    variables: []
  }
]