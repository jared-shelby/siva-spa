class CreateTransactions < ActiveRecord::Migration[7.0]
  def change
    create_table :transactions do |t|
      t.decimal :amount
      t.datetime :date
      t.string :merchant

      t.references :user
      t.references :category
      t.timestamps
    end
  end
end
