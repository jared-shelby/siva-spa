class TransactionSerializer < ActiveModel::Serializer
  attributes :id, :amount, :date, :merchant, :category
  belongs_to :user
  belongs_to :category

  def amount
    Money.from_amount(object.amount).format
  end

  def date
    object.date.strftime("%B %d, %Y")
  end
end
