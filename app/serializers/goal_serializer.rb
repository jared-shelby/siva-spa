class GoalSerializer < ActiveModel::Serializer
  attributes :id, :name, :amount, :target, :image
  belongs_to :user
end
