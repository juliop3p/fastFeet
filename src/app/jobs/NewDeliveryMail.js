import Mail from '../../lib/Mail';

class NewDeliveryMail {
  get key() {
    return 'NewDeliveryMail';
  }

  async handle({ data }) {
    const { deliveryman, recipient } = data;

    await Mail.sendMail({
      to: `${deliveryman.name} <${deliveryman.email}>`,
      subject: 'Novo produto a ser entrege',
      template: 'newdelivery',
      context: {
        deliverymanName: deliveryman.name,
        recipientName: recipient.name,
        street: recipient.street,
        number: recipient.number,
        city: recipient.city,
        state: recipient.state,
        zip_code: recipient.zip_code,
      },
    });
  }
}

export default new NewDeliveryMail();
