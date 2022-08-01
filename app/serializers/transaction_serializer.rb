class TransactionSerializer < ActiveModel::Serializer
  attributes :id, :amount, :date, :merchant
  belongs_to :user
  belongs_to :category
end
