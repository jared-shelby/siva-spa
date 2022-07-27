class CreateTransactions < ActiveRecord::Migration[7.0]
  def change
    create_table :transactions do |t|
      t.decimal :amount
      t.datetime :date
      t.string :merchant
      t.string :category

      t.references :user
      t.timestamps
    end
  end
end
