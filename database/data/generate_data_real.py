import random

random.seed(42)

# ==========================================
# CONFIG
# ==========================================

NUM_USERS = 200
NUM_AGENTS = 25
NUM_ORDERS = 500
NUM_REVIEWS = 150

# ==========================================
# HELPERS
# ==========================================

def escape_sql(value):
    return str(value).replace("'", "''")

# ==========================================
# REAL CLASSMATE NAMES
# ==========================================

real_names = [
    "Muhammad Abdullah",
    "Malik Abdulrafay Asif Khokhar",
    "Hamza Abid",
    "Abdul Kareem Aftab",
    "Malaika Ahmad",
    "Areeha Ahsan",
    "Zainab Ahsan",
    "Kirat Akram",
    "Muhammad Ali Kashif",
    "Abdullah Amir",
    "Fatima Amir",
    "Ahmad Ansar",
    "Ammara Ashraf",
    "Ayesha Atif",
    "Fizza Atif",
    "Muhammad Ayaan Asim",
    "Muhammad Daud Abid",
    "Mehwish Ehtesham",
    "Noor Fatima",
    "Muhammad Fuzail",
    "Abdul Hadi Bhutta",
    "Muhammad Hassaan Sohail",
    "Muhammad Hassan Malik",
    "Muhammad Haziq",
    "Shahbaz Hussain",
    "Muhammad Huzaifa",
    "Muhammad Jamal Nasir",
    "Hadia Khalid",
    "Ibrahim Khan",
    "Nashwa Khan",
    "Hassaan Masood",
    "Muhammad Masoom",
    "Abdul Moiz",
    "Hafiz Abdul Moiz",
    "Khadija Mughees",
    "Bilal Muhammad Qadeer",
    "Syed Muhammad Taha Hasnain",
    "Ahmad Mujtaba",
    "Hamayl Naveed",
    "Memoona Naveed",
    "Hasan Noman",
    "Muhammad Rayan Jalil",
    "Usman Shafiq",
    "Zoha Sohail",
    "Hafiz Sudais Ismail",
    "Raheel Suhail",
    "Muhammad Talha Sami",
    "Zainab Tariq",
    "Safi Ullah",
    "Muhammad Umar Noon",
    "Ali Zafar Awan",
    "Muhammad Zaryab Hanif",
    "Abdullah Zulfiqar"
]

first_names = [
    "Ali",
    "Ahmed",
    "Sara",
    "Fatima",
    "Usman",
    "Ayesha",
    "Hassan",
    "Bilal",
    "Noor",
    "Hamza"
]

last_names = [
    "Khan",
    "Malik",
    "Ahmed",
    "Raza",
    "Sheikh",
    "Farooq",
    "Iqbal"
]

cities = [
    "Lahore",
    "Karachi",
    "Islamabad",
    "Rawalpindi",
    "Faisalabad"
]

# ==========================================
# RESTAURANT
# ==========================================

RESTAURANT_NAME = "Fusion Bites"

# ==========================================
# MENU
# ==========================================

menu = {

    "Appetizers": [
        ("Crispy Green Beans", 1290),
        ("Chili Garlic Green Beans", 1150),
        ("Vegetable Spring Rolls", 850),
        ("Dumplings", 1390),
        ("Chicken Lettuce Wraps", 1490),
        ("Dynamite Chicken", 2350),
        ("The Original Dynamite Shrimp", 2450),
    ],

    "Soups": [
        ("Hot & Sour Soup", 1850),
        ("Wonton Soup", 2090),
        ("Thai Soup", 1750),
    ],

    "Chicken Entrees": [
        ("Kung Pao Chicken", 2290),
        ("Orange Chicken", 2290),
        ("Sesame Chicken", 2290),
    ],

    "Beef Entrees": [
        ("Mongolian Beef", 2850),
        ("Pepper Steak", 2850),
    ],

    "Seafood": [
        ("Kung Pao Shrimp", 2590),
        ("Crispy Honey Shrimp", 2590),
    ],

    "Pakistani": [
        ("Chicken Biryani", 890),
        ("Chicken Karahi", 2450),
        ("Butter Chicken", 2350),
    ],

    "Pizza": [
        ("Fajita Pizza", 2890),
        ("Pepperoni Pizza", 2950),
    ],

    "Desserts": [
        ("Molten Lava Cake", 850),
        ("Kunafa", 1350),
    ],

    "Drinks": [
        ("Mint Margarita", 650),
        ("Cold Coffee", 850),
        ("Soft Drink", 250),
    ]
}

# ==========================================
# HELPERS
# ==========================================

def generate_name(i):

    if i <= len(real_names):
        return real_names[i - 1]

    return (
        random.choice(first_names)
        + " "
        + random.choice(last_names)
    )

def generate_email(name, i):

    return (
        name.lower()
        .replace(" ", "")
        + str(i)
        + "@mail.com"
    )

# ==========================================
# GENERATE SQL FILE
# ==========================================

with open("data.sql", "w", encoding="utf-8") as file:

    # ======================================
    # USERS
    # ======================================

    for i in range(1, NUM_USERS + 1):

        name = escape_sql(generate_name(i))

        email = escape_sql(
            generate_email(name, i)
        )

        password = "customer123"

        role = "customer"

        phone = (
            "03"
            + str(random.randint(
                100000000,
                999999999
            ))
        )

        city = escape_sql(
            random.choice(cities)
        )

        file.write(
            f"""
INSERT INTO Users
(
    name,
    email,
    password,
    role,
    phone,
    address
)
VALUES
(
    '{name}',
    '{email}',
    '{password}',
    '{role}',
    '{phone}',
    '{city}'
);
"""
        )

    # ======================================
    # ADMIN USER
    # ======================================

    file.write(
        """
INSERT INTO Users
(
    name,
    email,
    password,
    role,
    phone,
    address
)
VALUES
(
    'Admin',
    'admin@fusionbites.com',
    'admin123',
    'admin',
    '03000000000',
    'Lahore'
);
"""
    )

    # ======================================
    # RESTAURANT
    # ======================================

    file.write(
        f"""
INSERT INTO Restaurants
(
    name,
    location,
    rating
)
VALUES
(
    '{escape_sql(RESTAURANT_NAME)}',
    'Lahore',
    4.8
);
"""
    )

    # ======================================
    # DELIVERY AGENTS
    # ======================================

    for i in range(1, NUM_AGENTS + 1):

        name = escape_sql(
            random.choice(first_names)
            + " "
            + random.choice(last_names)
        )

        phone = (
            "03"
            + str(random.randint(
                100000000,
                999999999
            ))
        )

        vehicle = random.choice([
            "Bike",
            "Car"
        ])

        file.write(
            f"""
INSERT INTO DeliveryAgents
(
    name,
    phone,
    vehicle_type
)
VALUES
(
    '{name}',
    '{phone}',
    '{vehicle}'
);
"""
        )

    # ======================================
    # MENU ITEMS
    # ======================================

    item_prices = {}

    item_id = 1

    for category, items in menu.items():

        for item_name, price in items:

            safe_item_name = escape_sql(item_name)

            safe_category = escape_sql(category)

            description = (
                f"Delicious {item_name} from Fusion Bites"
            )

            safe_description = escape_sql(description)

            file.write(
                f"""
INSERT INTO MenuItems
(
    restaurant_id,
    name,
    category,
    description,
    price
)
VALUES
(
    1,
    '{safe_item_name}',
    '{safe_category}',
    '{safe_description}',
    {price}
);
"""
            )

            item_prices[item_id] = price

            item_id += 1

    TOTAL_MENU_ITEMS = item_id - 1

    # ======================================
    # ORDERS
    # ======================================

    order_statuses = [
        "Placed",
        "Preparing",
        "Out for Delivery",
        "Delivered"
    ]

    order_totals = {}

    for order_id in range(1, NUM_ORDERS + 1):

        user_id = random.randint(
            1,
            NUM_USERS
        )

        agent_id = random.randint(
            1,
            NUM_AGENTS
        )

        status = escape_sql(
            random.choice(order_statuses)
        )

        delivery_address = escape_sql(
            random.choice(cities)
        )

        file.write(
            f"""
INSERT INTO Orders
(
    user_id,
    restaurant_id,
    agent_id,
    delivery_address,
    total_amount,
    status
)
VALUES
(
    {user_id},
    1,
    {agent_id},
    '{delivery_address}',
    0,
    '{status}'
);
"""
        )

    # ======================================
    # ORDER ITEMS
    # ======================================

    for order_id in range(1, NUM_ORDERS + 1):

        used = set()

        total_amount = 0

        for _ in range(random.randint(1, 5)):

            item_id = random.randint(
                1,
                TOTAL_MENU_ITEMS
            )

            if item_id in used:
                continue

            used.add(item_id)

            quantity = random.randint(1, 3)

            item_price = item_prices[item_id]

            subtotal = (
                item_price * quantity
            )

            total_amount += subtotal

            file.write(
                f"""
INSERT INTO OrderItems
(
    order_id,
    item_id,
    quantity,
    item_price,
    subtotal
)
VALUES
(
    {order_id},
    {item_id},
    {quantity},
    {item_price},
    {subtotal}
);
"""
            )

        order_totals[order_id] = total_amount

    # ======================================
    # UPDATE ORDER TOTALS
    # ======================================

    for order_id, total_amount in order_totals.items():

        file.write(
            f"""
UPDATE Orders
SET total_amount = {total_amount}
WHERE order_id = {order_id};
"""
        )

    # ======================================
    # PAYMENTS
    # ======================================

    methods = [
        "Cash",
        "Card",
        "Online"
    ]

    payment_statuses = [
        "Completed",
        "Pending"
    ]

    for order_id in range(1, NUM_ORDERS + 1):

        amount = order_totals[order_id]

        method = escape_sql(
            random.choice(methods)
        )

        payment_status = escape_sql(
            random.choice(payment_statuses)
        )

        transaction_reference = (
            "TXN"
            + str(random.randint(
                100000,
                999999
            ))
        )

        file.write(
            f"""
INSERT INTO Payments
(
    order_id,
    amount,
    method,
    status,
    transaction_reference
)
VALUES
(
    {order_id},
    {amount},
    '{method}',
    '{payment_status}',
    '{transaction_reference}'
);
"""
        )

    # ======================================
    # INVOICES
    # ======================================

    for order_id in range(1, NUM_ORDERS + 1):

        subtotal = order_totals[order_id]

        tax = round(subtotal * 0.05, 2)

        delivery_fee = 200

        total = (
            subtotal
            + tax
            + delivery_fee
        )

        invoice_number = (
            "INV-"
            + str(order_id).zfill(5)
        )

        file.write(
            f"""
INSERT INTO Invoices
(
    order_id,
    invoice_number,
    subtotal,
    tax,
    delivery_fee,
    total_amount
)
VALUES
(
    {order_id},
    '{invoice_number}',
    {subtotal},
    {tax},
    {delivery_fee},
    {total}
);
"""
        )

    # ======================================
    # TRANSACTIONS
    # ======================================

    for payment_id in range(
        1,
        NUM_ORDERS + 1
    ):

        amount = order_totals[payment_id]

        transaction_reference = (
            "TRX"
            + str(random.randint(
                100000,
                999999
            ))
        )

        file.write(
            f"""
INSERT INTO Transactions
(
    payment_id,
    transaction_reference,
    transaction_type,
    amount,
    transaction_status
)
VALUES
(
    {payment_id},
    '{transaction_reference}',
    'Payment',
    {amount},
    'Completed'
);
"""
        )

    # ======================================
    # REVIEWS
    # ======================================

    comments = [
        "Amazing food",
        "Very tasty",
        "Fast delivery",
        "Excellent experience",
        "Highly recommended",
        "Fresh and delicious",
        "Will order again"
    ]

    for i in range(1, NUM_REVIEWS + 1):

        user_id = random.randint(
            1,
            NUM_USERS
        )

        rating = random.randint(3, 5)

        comment = escape_sql(
            random.choice(comments)
        )

        file.write(
            f"""
INSERT INTO Reviews
(
    user_id,
    restaurant_id,
    rating,
    comment
)
VALUES
(
    {user_id},
    1,
    {rating},
    '{comment}'
);
"""
        )

print("✅ Fusion Bites ERP dataset generated successfully!")